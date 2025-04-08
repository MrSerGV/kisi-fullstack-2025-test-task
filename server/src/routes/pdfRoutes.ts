import { Router } from 'express';
import puppeteer from 'puppeteer';
import type { Request, Response } from 'express';

import 'dotenv/config';

const router = Router();

interface RenderPDFRequest {
    htmlContent: string;
}

router.post('/', async (req: Request<{}, {}, RenderPDFRequest>, res: Response) => {
    const { htmlContent } = req.body;

    if (!htmlContent) {
        res.status(400).send('HTML content is required');
        return;
    }
    try {
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
        });

        await browser.close();
        
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length.toString(),
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

export default router;

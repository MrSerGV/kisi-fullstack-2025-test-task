import { Router } from 'express';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const router = Router();


router.get('/', (req, res) => {
    try {
        const filePath = path.resolve(__dirname, '../events.json');
        const stream = fs.createReadStream(filePath);

        stream.on('error', (err) => {
            console.error('Error reading the file:', err);
            if (!res.headersSent) {
                res.status(500).send('Failed to fetch the report data.');
            }
        });

        stream.pipe(res);

        res.on('close', () => {
            stream.destroy(); // Clean up if the client disconnects
            console.warn('Client disconnected before file transfer completed.');
        });
    } catch (error) {
        console.error('Error getting the file:', error);
    }
    
});

export default router;

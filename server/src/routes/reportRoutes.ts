import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();


router.get('/', (req, res) => {
    const filePath = path.resolve('../server/src/events.json');
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
});

export default router;

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler } from './middelwares/errorHandler.js';
import rootRoutes from './routes/rootRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

import 'dotenv/config';

const app = express();
const corsOptions = {
    origin: process.env.CLIENT_ROUTE,
    methods: 'GET,POST',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(errorHandler);

app.use('/', rootRoutes);
app.use('/render-pdf', pdfRoutes);
app.use('/get-report-data', reportRoutes);

const HOST = process.env.SERVER_HOST
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});

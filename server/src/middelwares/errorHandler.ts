import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.type === 'entity.too.large') {
        res.status(413).send('Payload too large! Please reduce the size of your request.');
    } else {
        next(err);
    }
};

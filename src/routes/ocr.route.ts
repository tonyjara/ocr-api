import express, { Response, Request, NextFunction } from 'express';
import { ocrImageUpload } from '../controllers/ocr.controller';
import { logger } from '../utils/logger';

export const ocrRoute = express.Router();

ocrRoute.post(
  '/upload',
  async (req: Request, res: Response, next: NextFunction) => {
    await ocrImageUpload(req, res, next);
  }
);

ocrRoute.get('/upload', async (req: Request, res: Response) => {
  try {
    res.status(200).send('Ocr upload api feeling fine and dandy');
  } catch (err) {
    logger.error(err);
    return res.status(400).send(err);
  }
});

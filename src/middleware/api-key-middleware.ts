import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import validateEnv from '../utils/validateEnvs';

const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { API_KEY } = validateEnv();
    const apiKey = req.header('x-api-key');

    if (API_KEY !== apiKey) {
      res.sendStatus(401);
    } else {
      next();
    }
  } catch (error) {
    logger.error(error);
  }
};

export default apiKeyMiddleware;

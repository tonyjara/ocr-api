import express, { Response, Request } from 'express';

export const indexRoute = express.Router();

indexRoute.get('/', (req: Request, res: Response) => {
  res.send("I'm alive");
});

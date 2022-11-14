import express from 'express';
import { indexRoute } from './index.route';

import { ocrRoute } from './ocr.route';

const router = express.Router();

router.use('/ocr', ocrRoute);
router.use('/', indexRoute);

export { router };

import { Response, Request } from 'express';
import { createWorker } from 'tesseract.js';
import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { NextFunction } from 'express-serve-static-core';
import { logger } from '../utils/logger';
import validateEnv from '../utils/validateEnvs';

const worker = createWorker();
const { OCR_LANG } = validateEnv();

const ocrImageAndReturnPdf = async (
  buffer: Buffer,
  filename: string,
  formatedDate: string
) => {
  /* Recognizes the image, generates the text.
    Then from the worker, generates pdf data.
    & Worker.terminate() crashes the app.
    !Orientation matters.
    */
  await worker.load();
  await worker.loadLanguage(OCR_LANG);
  await worker.initialize(OCR_LANG);

  const {
    data: { text },
  } = await worker.recognize(buffer);

  const pdf = await worker.getPDF();

  const filenameWithNoExtension = filename.replace(/\.[^/.]+$/, '');

  await fs.promises.writeFile(
    `processed/${formatedDate}/${filenameWithNoExtension}.pdf`,
    Buffer.from(pdf.data)
  );
  return text;
};

const storage = (uuid: string, formatedDate: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${formatedDate}`);
    },
    filename: (req, file, cb) => {
      const filename = `${uuid} ${file.originalname}`;

      cb(null, filename);
    },
  });
};


const makeDirs = async (formatedDate: string) => {
  await fs.promises.mkdir(`processed/${formatedDate}`, { recursive: true });
  await fs.promises.mkdir(`uploads/${formatedDate}`, { recursive: true });
};

export const ocrImageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuid = uuidv4();
    const formatedDate = format(new Date(), 'dd-MM-yyyy');

    await makeDirs(formatedDate);

    const upload = multer({
      storage: storage(uuid, formatedDate),
    }).single(
      'image' //key of the multipart form request
    );
    upload(req, res, async () => {
      const filename = `${uuid} ${req.file?.originalname}`;

      const buffer = await fs.promises.readFile(
        `uploads/${formatedDate}/${filename}`
      );
      const text = await ocrImageAndReturnPdf(buffer, filename, formatedDate);
      logger.info(`finished scanning ${filename}`);

      res.status(200).json({ uuid, text });
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

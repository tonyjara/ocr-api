"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrImageUpload = void 0;
const tesseract_js_1 = require("tesseract.js");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const logger_1 = require("../utils/logger");
const validateEnvs_1 = __importDefault(require("../utils/validateEnvs"));
const worker = (0, tesseract_js_1.createWorker)();
const { OCR_LANG } = (0, validateEnvs_1.default)();
const ocrImageAndReturnPdf = (buffer, filename, formatedDate) => __awaiter(void 0, void 0, void 0, function* () {
    /* Recognizes the image, generates the text.
      Then from the worker, generates pdf data.
      & Worker.terminate() crashes the app.
      !Orientation matters.
      */
    yield worker.load();
    yield worker.loadLanguage(OCR_LANG);
    yield worker.initialize(OCR_LANG);
    const { data: { text }, } = yield worker.recognize(buffer);
    const pdf = yield worker.getPDF();
    const filenameWithNoExtension = filename.replace(/\.[^/.]+$/, '');
    fs_1.default.writeFile(`processed/${formatedDate}/${filenameWithNoExtension}.pdf`, Buffer.from(pdf.data), (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            logger_1.logger.error(err);
        // await worker.terminate();
    }));
    return text;
});
const storage = (uuid, formatedDate) => multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads/${formatedDate}`);
    },
    filename: (req, file, cb) => {
        const filename = `${uuid} ${file.originalname}`;
        cb(null, filename);
    },
});
const makeDirs = (formatedDate) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.mkdir(`processed/${formatedDate}`, { recursive: true }, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            logger_1.logger.error(err);
    }));
    fs_1.default.mkdir(`uploads/${formatedDate}`, { recursive: true }, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            logger_1.logger.error(err);
    }));
});
const ocrImageUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uuid = (0, uuid_1.v4)();
        const formatedDate = (0, date_fns_1.format)(new Date(), 'dd-MM-yyyy');
        yield makeDirs(formatedDate);
        const upload = (0, multer_1.default)({ storage: storage(uuid, formatedDate) }).single('image' //key of the multipart form request
        );
        upload(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const filename = `${uuid} ${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`;
            fs_1.default.readFile(`uploads/${formatedDate}/${filename}`, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    logger_1.logger.error(err);
                const text = yield ocrImageAndReturnPdf(buffer, filename, formatedDate);
                logger_1.logger.info(`finished scanning ${filename}`);
                res.status(200).json({ uuid, text });
            }));
        }));
    }
    catch (err) {
        logger_1.logger.error(err);
        next(err);
    }
});
exports.ocrImageUpload = ocrImageUpload;

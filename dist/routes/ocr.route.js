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
exports.ocrRoute = void 0;
const express_1 = __importDefault(require("express"));
const ocr_controller_1 = require("../controllers/ocr.controller");
const logger_1 = require("../utils/logger");
exports.ocrRoute = express_1.default.Router();
exports.ocrRoute.post('/upload', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, ocr_controller_1.ocrImageUpload)(req, res, next);
}));
exports.ocrRoute.get('/upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send('Ocr upload api feeling fine and dandy');
    }
    catch (err) {
        logger_1.logger.error(err);
        return res.status(400).send(err);
    }
}));

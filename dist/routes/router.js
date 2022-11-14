"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const index_route_1 = require("./index.route");
const ocr_route_1 = require("./ocr.route");
const router = express_1.default.Router();
exports.router = router;
router.use('/ocr', ocr_route_1.ocrRoute);
router.use('/', index_route_1.indexRoute);

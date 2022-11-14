"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
const validateEnvs_1 = __importDefault(require("../utils/validateEnvs"));
const apiKeyMiddleware = (req, res, next) => {
    try {
        const { API_KEY } = (0, validateEnvs_1.default)();
        const apiKey = req.header('x-api-key');
        if (API_KEY !== apiKey) {
            res.sendStatus(401);
        }
        else {
            next();
        }
    }
    catch (error) {
        logger_1.logger.error(error);
    }
};
exports.default = apiKeyMiddleware;

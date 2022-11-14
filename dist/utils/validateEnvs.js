"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function validateEnv() {
    return (0, envalid_1.cleanEnv)(process.env, {
        API_KEY: (0, envalid_1.str)(),
        NODE_ENV: (0, envalid_1.str)({ choices: ['development', 'test', 'production'] }),
        PORT: (0, envalid_1.port)(),
        //Logs
        LOG_FORMAT: (0, envalid_1.str)({ choices: ['dev', 'combined'] }),
        LOG_DIR: (0, envalid_1.str)(),
        //CORS
        ORIGIN: (0, envalid_1.str)(),
        CREDENTIALS: (0, envalid_1.bool)(),
        //OCR CONFIG
        OCR_LANG: (0, envalid_1.str)(),
    });
}
exports.default = validateEnv;

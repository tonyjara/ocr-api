import { bool, cleanEnv, port, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

function validateEnv() {
  return cleanEnv(process.env, {
    API_KEY: str(),
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    PORT: port(),
    //Logs
    LOG_FORMAT: str({ choices: ['dev', 'combined'] }),
    LOG_DIR: str(),
    //CORS
    ORIGIN: str(),
    CREDENTIALS: bool(),
    //OCR CONFIG
    OCR_LANG: str(),
  });
}

export default validateEnv;

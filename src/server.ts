import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import { router } from './routes/router';
import apiKeyMiddleware from './middleware/api-key-middleware';
import { limiter } from './middleware/rate-limiter';
import errorMiddleware from './middleware/error.middleware';
import { logger, stream } from './utils/logger';
import validateEnv from './utils/validateEnvs';

const { PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, NODE_ENV } = validateEnv(); // Checks that envs are present and adds validation.

const app: Express = express();
const port = PORT;

//Middlewares
app.use(morgan(LOG_FORMAT, { stream })); //HTTP request logger
app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
app.use(hpp()); //HTTP parameter pollution
app.use(helmet()); // Sets default headers
app.use(apiKeyMiddleware);
app.use(limiter);
app.use(express.json());

// Routes
app.use('/api', router);
app.get('/healthz', function (req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send('I am happy and healthy\n');
});

//Error logging
app.use(errorMiddleware);

const server = app.listen(port, () => {
  logger.info(`=================================`);
  logger.info(`======= ENV: ${NODE_ENV} =======`);
  logger.info(`🚀 App listening on the port ${PORT}`);
  logger.info(`=================================`);
});

const shutdown = () => {
  server.close((err) => {
    if (err) {
      logger.error(err);
      process.exitCode = 1;
    }

    process.exit();
  });
};

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
  logger.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ');
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
  logger.info('Got SIGTERM (docker container stop). Graceful shutdown ');
  shutdown();
});

export { app };

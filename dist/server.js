"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const router_1 = require("./routes/router");
const api_key_middleware_1 = __importDefault(require("./middleware/api-key-middleware"));
const rate_limiter_1 = require("./middleware/rate-limiter");
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const logger_1 = require("./utils/logger");
const validateEnvs_1 = __importDefault(require("./utils/validateEnvs"));
const { PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, NODE_ENV } = (0, validateEnvs_1.default)(); // Checks that envs are present and adds validation.
const app = (0, express_1.default)();
exports.app = app;
const port = PORT;
//Middlewares
app.use((0, morgan_1.default)(LOG_FORMAT, { stream: logger_1.stream })); //HTTP request logger
app.use((0, cors_1.default)({ origin: ORIGIN, credentials: CREDENTIALS }));
app.use((0, hpp_1.default)()); //HTTP parameter pollution
app.use((0, helmet_1.default)()); // Sets default headers
app.use(api_key_middleware_1.default);
app.use(rate_limiter_1.limiter);
// Routes
app.use('/api', router_1.router);
app.get('/healthz', function (req, res) {
    // do app logic here to determine if app is truly healthy
    // you should return 200 if healthy, and anything else will fail
    // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
    res.send('I am happy and healthy\n');
});
//Error logging
app.use(error_middleware_1.default);
const server = app.listen(port, () => {
    logger_1.logger.info(`=================================`);
    logger_1.logger.info(`======= ENV: ${NODE_ENV} =======`);
    logger_1.logger.info(`🚀 App listening on the port ${PORT}`);
    logger_1.logger.info(`=================================`);
});
const shutdown = () => {
    server.close((err) => {
        if (err) {
            logger_1.logger.error(err);
            process.exitCode = 1;
        }
        process.exit();
    });
};
// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
    logger_1.logger.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ');
    shutdown();
});
// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
    logger_1.logger.info('Got SIGTERM (docker container stop). Graceful shutdown ');
    shutdown();
});

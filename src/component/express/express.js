import bodyParser from 'body-parser';
import compressionMiddleware from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import uuid from 'uuid';

import logger from '../logger/logger';

const requestLogger = (req, res, next) => {
  const rquid = uuid.v4();
  req.rquid = rquid;
  logger.info(`${req.method} request`, { url: req.url, method: req.method, rquid });
  next();
}

export default function (app) {
  app.use(helmet());
  app.use(compressionMiddleware());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: ['json', '+json'] }));
  app.use(requestLogger);

  app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache');
    next();
  });

  return app;
}

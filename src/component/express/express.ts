import type { Express as App } from 'express';
import bodyParser from 'body-parser';
import compressionMiddleware from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import requestLogger from '../logger/logger';
import securityContext from '../context/context.middleware';

export default function (app: App) {
  app.use(helmet());
  app.use(compressionMiddleware());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: ['json', '+json'] }));

  // Add rquid to request
  app.use(requestLogger);
  // Builds security context from request
  app.use(securityContext);

  app.use((_req, res, next) => {
    res.header('Cache-Control', 'private, no-cache');
    next();
  });

  return app;
}

import * as dotenv from 'dotenv';
dotenv.config();
import { createLightship } from 'lightship';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import Express, { Express as App } from 'express';
import helmet from 'helmet';
import securityContext from '@/middleware/context.middleware';
import errorHandler from '@/middleware/error.middleware';
import requestLogger from '@/middleware/requestLogger.middleware';
import router from './router';
import unknownRoute from '@/middleware/unknownRoute.middleware';
import logger from '@/components/logger';

// Lightship will starts an HTTP service on port 9000
const lightship = createLightship();

let app: App;

const PORT = process.env.port || '3000';

export default function startServer() {
  app = Express();

  app.use(helmet());
  app.use(compression());
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

  app.use(router);

  app.get('/', (_req, res) => res.send('ok'))
  app.get('/health-check', (_req, res) => res.send('ok'))
  app.get('/ping', (_req, res) => res.send('pong'))

  app.listen(PORT, function() {
    logger.info(`Server is running on port ${PORT}`);
    lightship.signalReady();
  });

  // Used to signal that server is still setting up
  // lightship.signalNotReady();

  const server = app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running on port ${PORT}`);
  });

  app.use(unknownRoute);
  app.use(errorHandler);

  // Handle any cleanup
  process.on('SIGTERM', () => {
    logger.debug('SIGTERM signal received: shutting down server');
    server.close(() => {
      logger.debug('Server terminated');
    });
  });
}

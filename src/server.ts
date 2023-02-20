// import { createLightship } from 'lightship'
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

// Lightship will start a HTTP service on port 9000.
// const lightship = createLightship()

let app: App;

export default {
  // Good practice to be able to retrieve our app.
  getServer: () => app,
  start: (port: string) => {
    const app = Express();

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

    // app.listen(port, function() {
    //   console.log(`Server is running on port ${port}`);
    //   lightship.signalReady()
    // });
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running on port ${port}`);
    });

    app.use(unknownRoute);
    app.use(errorHandler);
  },
  shutDown: () => {
    if (!!app) {
      console.log('Express server shutting down');
      process.exit(0);
    }
  },
};


// import { createLightship } from 'lightship'
import Express, { Express as App } from 'express';
import expressConfig from './component/express/express';
import errorHandler from './component/error/error.middleware';
import router from './router';

// Lightship will start a HTTP service on port 9000.
// const lightship = createLightship()

let app: App;

export default {
  // Good practice to be able to retrieve our app.
  getServer: () => app,
  start: (port: string) => {
    const express = Express();

    app = expressConfig(express);
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

    app.use(errorHandler);
  },
  shutDown: () => {
    if (!!app) {
      console.log('Express server shutting down');
      process.exit(0);
    }
  },
};

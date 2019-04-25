import Express from 'express';

import expressConfig from './component/express/express';
import router from '../router';
import joiErrorMiddleware from './component/celebrate/error.middleware';
import errorHandlerMiddleware from './component/error/errorHandler.middleware';

const port = process.env.PORT || 5000;
let app;

export default {
  // Good practice to be able to retrieve our app.
  getServer: () => app,
  start: () => {
    const express = Express();

    app = expressConfig(express);
    app.use(router);

    app.listen(port, function() {
      console.log(`Express server is running at http://localhost:${port}`);
    });

    app.use(joiErrorMiddleware);
    app.use(errorHandlerMiddleware);

    app.use((err, req, res, next) => {
      console.log('Handle error');
      if (err) {
        console.log(err);
      }
      next();
    });
  },
  shutDown: () => {
    if (app) {
      console.log('Express server shutting down');
      app.close(() => {
        console.log('Express server shut down: all inflight requests complete');
      });
    }
  },
};

import Express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from '@/middleware/error.middleware';
import requestLogger from '@/middleware/requestLogger.middleware';
import unknownRoute from '@/middleware/unknownRoute.middleware';
import router from './router';

const app = Express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: ['json', '+json'] }));  
app.use((_req, res, next) => {
  res.header('Cache-Control', 'private, no-cache');
  next();
});

app.use(requestLogger);

app.get('/', (_req, res) => res.send('ok'));
app.get('/health-check', (_req, res) => res.send('ok'));
app.get('/ping', (_req, res) => res.send('pong'));

app.use(router);  
app.use(unknownRoute);
app.use(errorHandler);

export default app;

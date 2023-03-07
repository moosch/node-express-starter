import { createLightship } from 'lightship';
import Logger from '@/components/logger';
import getConfig from '@/components/getConfig';
import app from './app';

const logger = new Logger('server');
const { PORT } = getConfig();

const lightship = createLightship();

// Used to signal that server is still setting up
lightship.signalNotReady();

const server = app.listen(PORT, () => {
  logger.info(`⚡️[server]: Server is running on port ${PORT}`);
  lightship.signalReady();
});

// Handle any cleanup
process.on('SIGTERM', () => {
  logger.debug('SIGTERM signal received: shutting down server');
  server.close(() => {
    logger.debug('Server terminated');
  });
});

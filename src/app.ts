import Logger from '@/components/logger';
import { fetchRepository } from '@/components/cache';
import { tokenSchema } from '@/models/userToken';
import server from './server';

const logger = new Logger('app');

async function setupCache() {
  await fetchRepository('token', tokenSchema);
}

async function start() {
  await server();
  await setupCache();
}

start()
  .then((_) => {
    logger.info('Server started.');
  }).catch((error) => {
    logger.error('Server failed to start.', error);
  });

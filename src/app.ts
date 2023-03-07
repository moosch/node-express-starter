import Logger from '@/components/logger';
import { createCache } from '@/components/cache';
import { tokensSchema } from '@/models/userToken';
import server from './server';

const logger = new Logger('app');

async function start() {
  await server();
  await createCache('token', tokensSchema);
}

start()
  .then((_) => {
    logger.info('Server started.');
  }).catch((error) => {
    logger.error('Server failed to start.', error);
    process.exit(1);
  });

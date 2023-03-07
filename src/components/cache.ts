import { Client, Entity, Repository, Schema } from 'redis-om';
import Logger from '@/components/logger';
import getConfig from '@/components/getConfig';

const logger = new Logger('cache_component');

export let client: Client;
/** @todo this is quite coupled - might be better coming from elsewhere */
export type RepositoryTypes = 'token' | 'user';

interface Repositories {
  [key:string]: Repository<Entity>
}

const Cache: Repositories = {};

const connect = async () => {
  const { REDIS_URL } = getConfig();

  // redis[s]://[[username][:password]@][host][:port][/db-number]
  client = await new Client().open(REDIS_URL);
  logger.info('Cache connected.');
}

export const createCache = async (type: RepositoryTypes, schema: Schema<Entity>) => {
  if (!client) await connect();

  if (Cache[type]) {
    logger.warn(`Cache ${type} already exists.`);
    return;
  }

  const repo = client.fetchRepository(schema);
  /** @todo check for better index strategy based on access patterns. */
  repo.createIndex();
  Cache[type] = repo;
};

export default Cache;

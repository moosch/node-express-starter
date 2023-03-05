import { Client, Entity, Repository, Schema } from 'redis-om';
import Logger from '@/components/logger';
import getConfig from '@/components/getConfig';
import { Nullable, Serializable } from '@/types';

const logger = new Logger('cache_component');

export let client: Client;
/** @todo this is quite coupled - might be better coming from elsewhere */
export type RepositoryTypes = 'token' | 'user';

interface Cache {
  [key:string]: Repository<Entity>
}

const repos: Cache = {};

const connect = async () => {
  const { REDIS_URL } = getConfig();

  // redis[s]://[[username][:password]@][host][:port][/db-number]
  client = await new Client().open(REDIS_URL);
  logger.info('Cache connected.');
}

export const fetchRepository = async (type: RepositoryTypes, schema: Schema<Entity>) => {
  if (!client) await connect();

  const repo = client.fetchRepository(schema);
  /** @todo check for better index strategy based on access patterns. */
  repo.createIndex();
  repos[type] = repo;
};


const create = async (type: RepositoryTypes, data: Serializable) => {
  const repo = repos[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }
  const entityId = await repo.save(data.toDynamic());
  if (!entityId) {
    logger.error('Failed to create Entity in cache.');
  }
};

const find = async (type: RepositoryTypes, userId: string, token: string): Promise<Nullable<Record<string, any>>> => {
  const repo = repos[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }
  const entity = await repo.search()
    .where('user_id').equals(userId)
    .and('token').equals(token).return.first();
  if (!entity) {
    logger.info(`Failed to find Entity with user_id ${user_id} and token in cache.`);
    return;
  }
  logger.info('Token found in cache.', entity);
  return entity.toJSON();
};

const update = async <T>(type: RepositoryTypes, userId: string, token: string): Promise<void> => {
  const repo = repos[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }
  const entity = await repo.search()
    .where('user_id').equals(userId)
    .and('token').equals(token).return.first();

  if (!entity) {
    logger.warn(`Failed to update cache for ${userId}. Entity not found.`);
    return;
  }

  entity.token = token;
  await repo.save(entity);
  logger.info('Token updates in cache.');
};

const remove = async <T>(type: RepositoryTypes, userId: string): Promise<void> => {
  const repo = repos[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }
  const entity = await repo.search()
    .where('user_id').equals(userId)
    .and('token').equals(token).return.first();

  if (!entity) {
    logger.warn(`Failed to remove cached token for ${userId}. Entity not found.`);
    return;
  }

  console.log(`Removing from cache ${entity.entityId}`)

  await repo.remove(entity.entityId);

  logger.info('Token removed from cache.');
};

export default {
  create,
  find,
  update,
  remove,
};

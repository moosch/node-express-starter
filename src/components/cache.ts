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

/** @todo convert to functions */
export default {
  create: async (type: RepositoryTypes, data: Serializable) => {
    const repo = repos[type];
    if (!repo) {
      logger.error(`Failed to find Cache Repo for ${type}.`);
      return;
    }
    const entityId = await repo.save(data.toDynamic());
    if (!entityId) {
      logger.error('Failed to create Entity in cache.');
    }
  },

  find: async (type: RepositoryTypes, user_id: string, token: string): Promise<Nullable<Record<string, any>>> => {
    const repo = repos[type];
    if (!repo) {
      logger.error(`Failed to find Cache Repo for ${type}.`);
      return;
    }
    const entity = await repo.search()
      .where('user_id').equals(user_id)
      .and('token').equals(token).return.first();
    if (!entity) {
      logger.info(`Failed to find Entity with user_id ${user_id} and token in cache.`);
      return;
    }
    logger.info('Token found in cache.', entity);
    return entity.toJSON();
  },

  update: async <T>(type: RepositoryTypes, entityId: string) => {
    /** @todo */
  },

  remove: async <T>(type: RepositoryTypes, entityId: string) => {
    const repo = repos[type];
    if (!repo) {
      logger.error(`Failed to find Cache Repo for ${type}.`);
      return;
    }
    await repo.remove(entityId);
    logger.info('Token removed from cache.');
  },
}

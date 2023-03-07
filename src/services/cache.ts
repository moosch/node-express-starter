import Logger from '@/components/logger';
import AuthEvents, { EventTypes, ListenerPayload } from '@/components/events';
import Cache, { RepositoryTypes } from '@/components/cache';
import { Nullable, Serializable } from '@/types';
import UserToken from '@/models/userToken';

const logger = new Logger('cache');

interface CacheUpdateProps {
  userId: string
  accessToken: string
  refreshToken: string
  newAccessToken: string
  newRefreshToken: string
}

const create = async (type: RepositoryTypes, data: Serializable): Promise<void> => {
  const repo = Cache[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }

  logger.debug('Data being saved', data.toDynamic());

  const entityId = await repo.createAndSave(data.toDynamic());
  if (!entityId) {
    logger.error('Failed to create Entity in cache.');
  }
  logger.debug('Tokens added to cache.');
};

const find = async (type: RepositoryTypes, userId: string, accessToken: string): Promise<Nullable<Record<string, any>>> => {
  const repo = Cache[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }
  const entity = await repo.search()
    .where('user_id').equals(userId)
    .and('access_token').equals(accessToken).all();
  logger.debug('entities found', entity)

  if (!entity || entity.length === 0) {
    logger.debug(`Failed to find Entity with user_id ${userId} and token in cache.`);
    return;
  }
  logger.debug('Token found in cache.', entity[0].toJSON());
  return entity[0].toJSON();
};

const update = async (type: RepositoryTypes, props: CacheUpdateProps): Promise<void> => {
  const repo = Cache[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }
  const entity = await repo.search()
    .where('user_id').equals(props.userId)
    .and('access_token').equals(props.accessToken).return.first();

  if (!entity) {
    logger.warn(`Failed to update cache for ${props.userId}. Entity not found.`);
    return;
  }

  logger.debug('Entity to update', entity);

  let record = entity.toJSON();
  record.access_token = props.newAccessToken;
  record.refresh_token = props.newRefreshToken;

  await repo.remove(entity.entityId);

  const entityId = await repo.createAndSave(record);
  if (!entityId) {
    logger.error('Failed to update Entity in cache.');
  }
  logger.debug('Tokens updated in cache.');
};

const remove = async (type: RepositoryTypes, userId: string, accessToken: string): Promise<void> => {
  const repo = Cache[type];
  if (!repo) {
    logger.error(`Failed to find Cache Repo for ${type}.`);
    return;
  }
  const entity = await repo.search()
    .where('user_id').equals(userId)
    .and('access_token').equals(accessToken).return.first();

  if (!entity) {
    logger.warn(`Failed to remove cached token for ${userId}. Entity not found.`);
    return;
  }

  logger.debug(`Removing from cache ${entity.entityId}`)

  await repo.remove(entity.entityId);
  logger.debug('Token removed from cache.');
};

export default {
  create,
  find,
  update,
  remove,
};

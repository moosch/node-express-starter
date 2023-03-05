import Logger from '@/components/logger';
import AuthEvents, { EventObject, EventTypes } from '@/components/events';

const logger = new Logger('cache');

export const addAccessToken = (userId: string, accessToken: string) => {
  /** @todo add to Redis */
};

// Get tokens by userId to be verified elsewhere
export const getAccessToken = (userId: string) => {
  /** @todo get from Redis */
};

export const deleteTokenByUserId = (userId: string) => {
  /** @todo remove from Redis */
};

function handleRefresh(EventObject event) {
  const { name, payload } = event;
  logger.debug(`Handling Event: ${name}`, { payload });
  /** @todo update cache for userId with tokens */
}
function handleLogout() {
  const { name, payload } = event;
  logger.debug(`Handling Event: ${name}`, { payload });
  /** @todo remove from cache for userId */
}

AuthEvents.addListener(EventTypes.AUTH_REFRESHED, handleRefresh);
AuthEvents.addListener(EventTypes.AUTH_LOGOUT, handleLogout);

export default {
  addAccessToken,
  getAccessToken,
  deleteTokenByUserId,
};

/**
 * Handles the API cache layer.
 * Currently only user tokens.
 */

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

export default {
  addAccessToken,
  getAccessToken,
  deleteTokenByUserId,
};

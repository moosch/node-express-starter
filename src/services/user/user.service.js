/**
 * The service layer is used to process actions to the persistence layer.
 * It's also the place where you can call other services to get data.
 * Additionally this would be a great place to emit Node events for subscribers.
 * For example creating a record is a common task that may have subscribers.
 * Emitting a 'USER_CREATED' event may be useful to trigger registration emails etc.
 */

import userData from './user.persistence';

export default {
  find: async (id) => {
    return userData.find(id);
  },

  findAll: async (limit, offset) => {
    return userData.findAll(limit, offset)
  },

  create: async (props) => {
    return userData.create(props);
  },

  update: async (id, props) => {
    return userData.update(id, props);
  },

  delete: async (id) => {
    return userData.delete(id);
  },
};

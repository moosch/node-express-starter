/**
 * Your UserModel is specific to your database and ORM choice.
 * The persistence layer will handle these ORM calls, implement logging,
 * and if required throw ORM/DB specific errors.
 */

import UserModel from './user.model';

export default {
  find: async (id) => {
    return UserModel.find(id);
  },

  findAll: async (limit, offset) => {
    return UserModel.findAll(limit, offset);
  },

  create: async (props) => {
    return UserModel.create(props);
  },

  update: async (id, props) => {
    const user = await UserModel.find(id);

    if (!user) {
      throw new Error('User not found');
    }

    return UserModel.update(id, props);
  },

  delete: async (id) => {
    return await UserModel.delete(id);
  },
};

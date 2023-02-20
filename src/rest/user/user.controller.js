/**
 * The controllers are used to call services and in some patterns to validate requests.
 * They are also the final stop where you respond to requests and handle errors.
 * It's also good practice to implement logging here (and in the service layer).
 */

import userService from '../../services/user/user.service';
import userErrors from '../../services/user/user.errors';
import errorHandler from '../../middleware/error.middleware';

export default {
  find: async (req, res) => {
    const { params: { id } } = req;

    try {
      const user = await userService.find(id);
      return res.status(200).json(user);
    } catch (err) {

    }
  },

  findAll: async (req, res) => {
    const { query: { limit, offset } } = req;

    const users = await userService.findAll(limit, offset);

    return res.status(200).json(users);
  },

  create: async (req, res) => {
    const { body: props } = req;

    const user = await userService.create(props);

    return res.status(200).json(user);
  },

  update: async (req, res) => {
    const {
      params: { id },
      body: props,
    } = req;

    const user = await userService.update(id, props);

    return res.status(200).json(user);
  },

  delete: async (req, res) => {
    const { params: { id } } = req;

    await userService.delete(id);

    return res.status(201).json();
  },

  errorHandler(err, req, res, next) {
    console.log('errorHandler', errorHandler);
    const errors = {
      INVALID_REQUEST: 400,
      USER_NOT_FOUND: 404,
    };

    const handler = errorHandler(err, res, errors);

    switch (err.constructor) {
      case userErrors.InvalidRequestError:
        return handler('INVALID_REQUEST');

      case userErrors.UserNotFoundError:
        return handler('USER_NOT_FOUND');

      default:
        // If the error is not something we expect, let it bubble up
        next(err);
    }
  },
};

import Joi, { joiAsExpressMiddleware } from '../../components/joi/joi';

const userParams = Joi.object().keys({
  id: Joi.string(),
});

const limitQuery = Joi.object().keys({
  limit: Joi.number().default(10), 
  offset: Joi.number().default(0),
});

const createBody = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().required(),
});

const updateBody = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().required(),
});

export default {
  find: joiAsExpressMiddleware({ params: userParams }),
  findAll: joiAsExpressMiddleware({ query: limitQuery }),
  create: joiAsExpressMiddleware({ body: createBody }),
  delete: joiAsExpressMiddleware({ params: userParams }),
  update: joiAsExpressMiddleware({ params: userParams, body: updateBody }),
};
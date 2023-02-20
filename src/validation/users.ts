import Joi from 'joi';
import validate from '@/middleware/validate.middleware';

const idParams = Joi.object().keys({
  id: Joi.string().required(),
});

const createBody = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().required(),
});

const updateBody = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  age: Joi.number(),
});

export default {
  get: validate({ params: idParams }),
  create: validate({ body: createBody }),
  update: validate({ params: idParams, body: updateBody }),
  delete: validate({ params: idParams }),
}

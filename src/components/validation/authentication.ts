import Joi from 'joi';
import validate from '@/middleware/validate.middleware';

const authBody = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshBody = Joi.object().keys({
  refreshToken: Joi.string().required(),
});

export default {
  signup: validate({ body: authBody }),
  signin: validate({ body: authBody }),
  refresh: validate({ body: refreshBody }),
}

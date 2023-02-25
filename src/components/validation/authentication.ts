import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
import validate from '@/middleware/validate.middleware';

const authBody = Joi.object().keys({
  email: Joi.string().email().required().label('Email'),
  password: passwordComplexity().required().label('Password'),
});

const refreshBody = Joi.object().keys({
  refreshToken: Joi.string().required().label('Refresh Token'),
});

export default {
  signup: validate({ body: authBody }),
  signin: validate({ body: authBody }),
  refresh: validate({ body: refreshBody }),
}

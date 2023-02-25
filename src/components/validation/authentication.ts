import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
import validate from '@/middleware/validate.middleware';

const signupBody = Joi.object().keys({
  email: Joi.string().email().required().label('email'),
  password: passwordComplexity({
    min: 12,
    max: 100,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
  }).required().label('password'),
}).with('email', 'password');

const signinBody = Joi.object().keys({
  email: Joi.string().email().required().label('email'),
  password: Joi.string().required().label('password'),
}).with('email', 'password');

const refreshBody = Joi.object().keys({
  refreshToken: Joi.string().required().label('refreshToken'),
});

export default {
  signup: validate({ body: signupBody }),
  signin: validate({ body: signinBody }),
  refresh: validate({ body: refreshBody }),
}

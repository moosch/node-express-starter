import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
import validate from '@/middleware/validate.middleware';

const idParams = Joi.object().keys({
  id: Joi.string().uuid().required().label('ID'),
});

const updateBody = Joi.object().keys({
  email: Joi.string().email().label('Email'),
  password: passwordComplexity().label('Password'),
});

export default {
  find: validate({ params: idParams }),
  update: validate({ params: idParams, body: updateBody }),
  remove: validate({ params: idParams }),
}

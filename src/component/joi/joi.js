import { celebrate, Joi } from 'celebrate';

const defaultJoiOptions = {
  allowUnknown: true,
  convert: true,
  stripUnknown: { arrays: false, objects: true },
  abortEarly: false,
};

const joiAsExpressMiddleware = (schema) => celebrate(schema, defaultJoiOptions);

export default Joi;
export { defaultJoiOptions, joiAsExpressMiddleware };
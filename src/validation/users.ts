import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../component/logger/logger';
import { ErrorCodes, ValidationSettings, ValidationTypes } from '../types';

const validationTypes: ValidationTypes[] = ['body', 'query', 'params'];

// const defaultJoiOptions = {
//   allowUnknown: true,
//   convert: true,
//   stripUnknown: { arrays: false, objects: true },
//   abortEarly: false,
// };

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

function validate(settings: ValidationSettings) {
  logger.debug('Validating');
  return (req: Request, res: Response, next: NextFunction) => {
    let errors = [];

    for (const type of validationTypes) {
      if (settings.hasOwnProperty(type)) {
        try {
          settings[type]?.validate(req[type]);
        } catch (err) {
          errors.push(err);
        }
      }
    }

    /**
     * @note We could optionally attach an error list to the request object
     * and allow a middleware downstream to check for it and handle it.
     */
    if (errors.length > 0) {
      res.status(ErrorCodes.INVALID_REQUEST);
      res.json({ errors });
      return;
    }

    next();
  }
}

export default {
  get: validate({ params: idParams }), // <url>/:id
  create: async (_req: Request, _res: Response, next: NextFunction) => {
    next();
  },
  update: validate({ params: idParams, body: createBody }),
  delete: validate({ params: idParams, body: updateBody }), // <url>/:id
}
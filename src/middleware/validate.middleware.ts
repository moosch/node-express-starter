import { Request, NextFunction } from 'express';
import { ErrorCodes, Response, ValidationSettings, ValidationTypes } from '@/types';
import logger from '@/components/logger';

const validationTypes: ValidationTypes[] = ['body', 'query', 'params'];

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

export default validate;

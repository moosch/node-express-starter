import { Request, NextFunction } from 'express';
import { ErrorCodes, Response, ValidationSettings, ValidationTypes } from '@/types';
import logger from '@/components/logger';

const validationTypes: ValidationTypes[] = ['body', 'query', 'params'];

function validate(settings: ValidationSettings) {
  return (req: Request, res: Response, next: NextFunction) => {
    let errors: string[] = [];

    for (const type of validationTypes) {
      if (settings.hasOwnProperty(type)) {
        const res = settings[type]?.validate(req[type]);
        if (res?.error) {
          res?.error.details.map((error) => errors.push(error.message));
        }
      }
    }

    if (errors.length > 0) {
      logger.debug('ValidationErrors', { errors });
      res.status(ErrorCodes.INVALID_REQUEST);
      return res.json({ errors });
    }

    next();
  }
}

export default validate;

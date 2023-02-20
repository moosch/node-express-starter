import { NextFunction, Request, Response } from 'express';
import { ErrorCodes } from '../../types/express/errors';

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  let body = {
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
    message: err.message || ErrorCodes[ErrorCodes.INTERNAL_SERVER_ERROR],
  };

  if (res.error) {
    body = {
      code: res.error as ErrorCodes,
      message: err.message || ErrorCodes[res.error as ErrorCodes],
    };
  }

  res.status(body.code);
  res.json(body);
};

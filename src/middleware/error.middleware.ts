import { NextFunction, Request } from 'express';
import { ErrorCodes, Response } from '@/types';

export default function errorMiddleware(err: any, _req: Request, res: Response, next: NextFunction) {
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

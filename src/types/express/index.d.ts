import { SecurityContext } from '../../component/context/context.d.ts';
import { ErrorCodes } from './errors.d.ts';

export {};

declare global {
  namespace Express {
    export interface Request {
      rquid?: string
      ctx?: SecurityContext
    }
    export interface Response {
      error?: ErrorCodes
    }
  }
}

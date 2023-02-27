import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import type Joi from 'joi';

export type Nullable<T> = T | undefined | null

export enum ErrorCodes {
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  INVALID_REQUEST = 400,
  FORBIDDEN = 403,
}

export interface Request extends ExpressRequest {
  rquid?: string
  ctx?: SecurityContext
}
export interface Response extends ExpressResponse {
  error?: ErrorCodes
}

export interface SecurityContext {
  _userId: string
  _token: string
}

export interface ValidationSettings {
  params?: Joi.ObjectSchema
  query?: Joi.ObjectSchema
  body?: Joi.ObjectSchema
}
export type ValidationTypes = keyof ValidationSettings;
export type Middleware = (req: Request, res: Response, next: NextFunction) => void

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface EncryptionPayload {
  hash: string
  salt: string
}

export type DBRecordTypes = string | number

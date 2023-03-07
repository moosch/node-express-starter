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
  _accessToken: string
}

export interface ValidationSettings {
  params?: Joi.ObjectSchema
  query?: Joi.ObjectSchema
  body?: Joi.ObjectSchema
}
export type ValidationTypes = keyof ValidationSettings;
export type Middleware = (req: Request, res: Response, next: NextFunction) => void

export interface Authentication {
  accessToken: string
  refreshToken: string
  userId: string
}

export type DBRecordTypes = string | number

export abstract class Serializable {
  static fromDynamic<T>(data?: any): any | T {};
  public toDynamic<T>(data?: any): any | Record<string, any> {};
}

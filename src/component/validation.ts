import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export interface ValidationOptions {
  allowUnknownBody?: boolean;
  allowUnknownQuery?: boolean;
  allowUnknownHeaders?: boolean;
  allowUnknownParams?: boolean;
  allowUnknownCookies?: boolean;
  joiOptions?: Joi.ValidationOptions;
}

export interface Validation {
  options?: ValidationOptions;
  body?: Joi.SchemaLike;
  headers?: Joi.SchemaLike;
  query?: Joi.SchemaLike;
  cookies?: Joi.SchemaLike;
  params?: Joi.SchemaLike;
}

const props = ['body', 'query', 'headers', 'params', 'cookies'];

export function validate(settings: Validation) {
  
}

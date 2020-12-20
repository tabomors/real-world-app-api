import * as Joi from 'joi';

export type ValidationError = Joi.ValidationError;

export const isValidationError = (e: Error): boolean => Joi.isError(e);

const NOT_UNIQ = 'NOT_UNIQ';
const AUTH_FAILED = 'AUTH_FAILED';

export class NotUniqError extends Error {
  public name = NOT_UNIQ;
}

export class AuthFailedError extends Error {
  public name = AUTH_FAILED;
}

export type ErrorResponseBody = {
  errors: {
    body: string[]
  }
};

export const buildErrorResponseBody = (errors: string[]): ErrorResponseBody => {
  return { errors: { body: errors } };
};

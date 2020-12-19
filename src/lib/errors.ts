import * as Joi from 'joi';

export type ValidationError = Joi.ValidationError;

const NOT_UNIQ = 'NOT_UNIQ';
const AUTH_FAILED = 'AUTH_FAILED';

export class NotUniqError extends Error {
  static type = NOT_UNIQ;

  static isNotUniqError(e: Error): e is NotUniqError {
    return e.name === NOT_UNIQ;
  }

  public name = NOT_UNIQ;
}

export class AuthFailedError extends Error {
  static type = AUTH_FAILED;

  static isAuthFailedError(e: Error): e is AuthFailedError {
    return e.name === AUTH_FAILED;
  }

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

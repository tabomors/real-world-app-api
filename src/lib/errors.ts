import * as Joi from 'joi';

export type ValidationError = Joi.ValidationError;

export const isValidationError = (e: Error): boolean => Joi.isError(e);

const NOT_UNIQ = 'NOT_UNIQ';
const AUTH_FAILED = 'AUTH_FAILED';
const NOT_FOUND = 'NOT_FOUND';

export class NotUniqError extends Error {
  name = NOT_UNIQ;
}

export class AuthFailedError extends Error {
  name = AUTH_FAILED;
}

export class NotFoundError extends Error {
  name = NOT_FOUND;
}

export type ErrorResponseBody = {
  errors: {
    body: string[]
  }
};

export const buildErrorResponseBody = (errors: string[]): ErrorResponseBody => {
  return { errors: { body: errors } };
};

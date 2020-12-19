import * as Joi from 'joi';

export type ValidationError = Joi.ValidationError;

const NOT_UNIQ = 'NOT_UNIQ';

export class NotUniqError extends Error {
  static type = NOT_UNIQ;

  static isNotUniqError(e: Error): e is NotUniqError {
    return e.name === NOT_UNIQ;
  }

  public name = NOT_UNIQ;
}

export type ErrorResponseBody = {
  errors: {
    body: string[]
  }
};

export const buildErrorResponseBody = (errors: string[]): ErrorResponseBody => {
  return { errors: { body: errors } };
};

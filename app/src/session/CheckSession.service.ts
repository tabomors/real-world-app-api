import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { AuthFailedError } from '../lib/errors';
import { verifyToken } from '../lib/jwt';

export type GetUserAuthParams = { token?: string; optional: boolean };

export type GetUserAuthResponse = {
  userId?: string;
};

export class CheckSession extends ServiceBase<
  GetUserAuthParams,
  GetUserAuthResponse,
  any
> {
  schema: Joi.SchemaLike = {
    token: Joi.string().allow(null),
    optional: Joi.boolean(),
  };
  async execute({
    token,
    optional,
  }: GetUserAuthParams): Promise<GetUserAuthResponse | undefined> {
    if (optional && !token) return { userId: undefined };
    try {
      const userData = verifyToken(token as string) as {
        id: string;
      };
      return { userId: userData.id };
    } catch (e) {
      throw new AuthFailedError();
    }
  }
}

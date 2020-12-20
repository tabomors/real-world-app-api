import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from './User.entity';
import { generateToken } from '../lib/jwt';
import { AuthFailedError } from '../lib/errors';

export type GetUserContext = { userId: string };

export type GetUserResponse = {
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
};

export class GetUser extends ServiceBase<any, GetUserResponse, GetUserContext> {
  schema: Joi.SchemaLike = Joi.any();
  async execute(): Promise<GetUserResponse | undefined> {
    try {
      const user = await User.findOne({ where: { id: this.context.userId } });

      if (!user) {
        throw new AuthFailedError();
      }

      const token = generateToken({ id: user.id });

      return {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token,
      };
    } catch (e) {
      throw new AuthFailedError();
    }
  }
}

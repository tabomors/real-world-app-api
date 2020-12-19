import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from './User.entity';
import { generateToken } from '../lib/jwt';
import { AuthFailedError } from '../lib/errors';

export type LoginUserParams = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
};

export class LoginUser extends ServiceBase<
  LoginUserParams,
  LoginUserResponse,
  Record<string, any>
> {
  schema: Joi.SchemaLike = {
    email: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string(),
  };

  async execute(
    params: LoginUserParams
  ): Promise<LoginUserResponse | undefined> {
    try {
      const user = await User.findOne({ where: { email: params.email } });
      const isPasswordCorrect = !!user?.checkPassword(params.password);

      if (!user || !isPasswordCorrect) {
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

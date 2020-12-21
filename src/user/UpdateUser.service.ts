import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from './User.entity';
import { generateToken } from '../lib/jwt';
import { AuthFailedError } from '../lib/errors';

export type UpdateUserContext = { userId: number };

export type UpdateUserParams = {
  email?: string;
  username?: string;
  bio?: string;
  image?: string;
};

export type UpdateUserResponse = {
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
};

export class UpdateUser extends ServiceBase<
  UpdateUserParams,
  UpdateUserResponse,
  UpdateUserContext
> {
  schema: Joi.SchemaLike = Joi.object({
    email: Joi.string().email().optional().allow(null),
    username: Joi.string().optional().allow(null),
    password: Joi.string().optional().allow(null),
    bio: Joi.string().optional().allow('').allow(''),
    image: Joi.string().optional().allow('').allow(''),
  }).min(1);
  async execute(
    params: UpdateUserParams
  ): Promise<UpdateUserResponse | undefined> {
    const user = await User.findOne({ where: { id: this.context.userId } });

    if (!user) {
      throw new AuthFailedError();
    }

    if (params.username) {
      user.username = params.username;
    }
    if (params.email) {
      user.email = params.email;
    }
    if (typeof params.bio === 'string') {
      user.bio = params.bio;
    }
    if (typeof params.image === 'string') {
      user.image = params.image;
    }

    await user.save();

    const token = generateToken({ id: user.id });

    return {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      token,
    };
  }
}

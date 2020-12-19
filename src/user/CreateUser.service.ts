import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User, CreateUserParams } from './User.entity';
import { generateToken } from '../lib/jwt';
import { NotUniqError } from '../lib/errors';

export type CreateUserResponse = {
  email: string;
  token?: string;
  username: string;
  bio?: string;
  image?: string;
};

export class CreateUser extends ServiceBase<
  CreateUserParams,
  CreateUserResponse,
  Record<string, any>
> {
  schema: Joi.SchemaLike = {
    email: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string(),
  };

  async execute(params: CreateUserParams): Promise<CreateUserResponse | undefined> {
    try {
      const user = new User();
      await user.registerUser(params).save();

      const token = generateToken({ id: user.id });

      return {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token,
      };
    } catch (e) {
      throw new NotUniqError();
    }
  }
}

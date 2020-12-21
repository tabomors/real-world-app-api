import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from '../user/User.entity';
import { Subscription } from './Subscription.entity';
import { NotFoundError } from '../lib/errors';

export type UnFollowUserParams = {
  username: string;
};

export type UnFollowUserResponse = {
  username: string;
  bio?: string;
  image?: string;
  following: false;
};

export type UnFollowUserContext = { userId: number };

export class UnFollowUser extends ServiceBase<
  UnFollowUserParams,
  UnFollowUserResponse,
  UnFollowUserContext
> {
  schema: Joi.SchemaLike = {
    username: Joi.string(),
  };
  async execute(
    params: UnFollowUserParams
  ): Promise<UnFollowUserResponse | undefined> {
    const user = await User.findOne({ where: { username: params.username } });
    if (!user) {
      throw new NotFoundError();
    }
    const subscription = await Subscription.findOne({
      where: { user_id: this.context.userId, following_id: user.id },
    });
    if (subscription) await subscription.remove();

    return {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: false,
    };
  }
}

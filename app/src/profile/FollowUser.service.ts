import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from '../user/User.entity';
import { Subscription } from './Subscription.entity';
import { NotFoundError } from '../lib/errors';

export type FollowUserParams = {
  username: string;
};

export type FollowUserResponse = {
  username: string;
  bio?: string;
  image?: string;
  following: true;
};

export type FollowUserContext = { userId: number };

export class FollowUser extends ServiceBase<
  FollowUserParams,
  FollowUserResponse,
  FollowUserContext
> {
  schema: Joi.SchemaLike = {
    username: Joi.string(),
  };
  async execute(
    params: FollowUserParams
  ): Promise<FollowUserResponse | undefined> {
    const user = await User.findOne({ where: { username: params.username } });
    if (!user) {
      throw new NotFoundError();
    }
    const subscription = new Subscription();
    subscription.user_id = this.context.userId;
    subscription.following_id = user.id;

    await subscription.save();

    return {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: true,
    };
  }
}

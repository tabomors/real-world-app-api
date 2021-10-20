import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from '../user/User.entity';
import { Subscription } from './Subscription.entity';
import { NotFoundError } from '../lib/errors';

export type GetProfileParams = {
  username: string;
};

export type GetProfileResponse = {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  following: boolean;
};

export type GetProfileContext = { userId?: string };

export class GetProfile extends ServiceBase<
  GetProfileParams,
  GetProfileResponse,
  GetProfileContext
> {
  schema: Joi.SchemaLike = {
    username: Joi.string(),
  };
  async execute(
    params: GetProfileParams
  ): Promise<GetProfileResponse | undefined> {
    const user = await User.findOne({ where: { username: params.username } });

    if (!user) {
      throw new NotFoundError();
    }

    const currentUser = this.context.userId
      ? await User.findOne({ where: { id: this.context.userId } })
      : undefined;

    const following = currentUser?.id
      ? await Subscription.isFollowing(currentUser?.id, user.id)
      : false;

    return {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: following,
    };
  }
}

import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { Subscription } from '../profile/Subscription.entity';
import { CommentResponse } from './Article.types';
import { NotFoundError } from '../lib/errors';

export type GetCommentsParams = {
  slug: string;
};

export type GetCommentsResponse = {
  data: CommentResponse[];
};

export type GetCommentsContext = { userId?: string };

export class GetComments extends ServiceBase<
  GetCommentsParams,
  GetCommentsResponse,
  GetCommentsContext
> {
  schema: Joi.SchemaLike = {
    slug: Joi.string().required(),
  };
  async execute(
    params: GetCommentsParams
  ): Promise<GetCommentsResponse | undefined> {
    const article = await Article.findOne({
      where: { slug: params.slug },
      relations: ['comments', 'comments.author'],
    });
    if (!article) throw new NotFoundError();
    const comments = article.comments;

    let followingIds: number[] = [];
    if (this.context.userId) {
      const subscriptions = await Subscription.find({
        where: { user_id: this.context.userId },
      });
      followingIds = subscriptions.map((s) => s.following_id);
    }

    return {
      data: comments.map((c) => ({
        id: c.id,
        createdAt: c.created_at.toISOString(),
        updatedAt: c.updated_at.toISOString(),
        body: c.body,
        author: {
          following: followingIds.includes(c.author.id),
          username: c.author.username,
          bio: c.author.bio,
          image: c.author.image,
        },
      })),
    };
  }
}

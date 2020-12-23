import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from '../user/User.entity';
import { Article } from './Article.entity';
import { Comment } from './Comment.entity';
import { CommentResponse } from './Article.types';
import { NotFoundError, AuthFailedError } from '../lib/errors';

export type CreateCommentParams = {
  slug: string;
  body: string;
};

export type CreateCommentContext = { userId: number };

export class CreateComment extends ServiceBase<
  CreateCommentParams,
  CommentResponse,
  CreateCommentContext
> {
  schema: Joi.SchemaLike = {
    slug: Joi.string().required(),
    body: Joi.string().required(),
  };

  async execute(
    params: CreateCommentParams
  ): Promise<CommentResponse | undefined> {
    const author = await User.findOne({ where: { id: this.context.userId } });
    if (!author) throw new AuthFailedError();
    const article = await Article.findOne({ where: { slug: params.slug } });
    if (!article) throw new NotFoundError();
    const comment = new Comment();
    comment.body = params.body;
    comment.article = article;
    comment.author = author;
    await comment.save();

    return {
      body: comment.body,
      id: comment.id,
      createdAt: comment.created_at.toISOString(),
      updatedAt: comment.created_at.toISOString(),
      author: {
        following: false,
        username: author.username,
        bio: author.bio,
        image: author.image,
      },
    };
  }
}

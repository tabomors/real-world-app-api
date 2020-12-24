import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { ForbiddenError, NotFoundError } from '../lib/errors';
import { Comment } from './Comment.entity';

export type DeleteCommentParams = {
  slug: string;
  id: string;
};

export type DeleteCommentContext = { userId: number };

export class DeleteComment extends ServiceBase<
  DeleteCommentParams,
  any,
  DeleteCommentContext
> {
  schema: Joi.SchemaLike = {
    slug: Joi.string().required(),
    id: Joi.string().required(),
  };

  async execute(params: DeleteCommentParams): Promise<boolean | undefined> {
    const article = await Article.findOne({ where: { slug: params.slug } });
    const comment = await Comment.findOne({ where: { id: params.id } });

    if (!comment || !article) throw new NotFoundError();
    if (comment?.author.id !== this.context.userId) throw new ForbiddenError();

    if (article.comments.some((c) => c.id === comment.id)) {
      article.comments = article.comments.filter((c) => c.id !== comment.id);
      await Promise.all([article.save(), comment.remove()]);
      return true;
    }

    throw new NotFoundError();
  }
}

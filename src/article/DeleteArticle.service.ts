import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { ForbiddenError, NotFoundError } from '../lib/errors';

export type DeleteArticleParams = {
  slug: string;
};

export type DeleteArticleContext = { userId: number };

export class DeleteArticle extends ServiceBase<
  DeleteArticleParams,
  any,
  DeleteArticleContext
> {
  schema: Joi.SchemaLike = { slug: Joi.string().required() };

  async execute(
    params: DeleteArticleParams
  ): Promise<boolean | undefined> {
    const article = await Article.findOne({ where: { slug: params.slug } });

    if (!article) throw new NotFoundError();
    if (article?.author_id !== this.context.userId) throw new ForbiddenError();

    await article.remove();

    return true;
  }
}

import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { ForbiddenError, NotFoundError } from '../lib/errors';
import { ArticleResponse } from './Article.types';
import { mapArticleModelToArticleResponse } from './Article.mappers';

export type UpdateArticleParams = {
  slug: string;
  title?: string;
  description?: string;
  body?: string;
};

export type UpdateArticleContext = { userId: number };

export class UpdateArticle extends ServiceBase<
  UpdateArticleParams,
  ArticleResponse,
  UpdateArticleContext
> {
  // NOTE: check this article http://eloquentcode.com/require-an-object-to-contain-at-least-one-key-in-a-joi-schema
  schema: Joi.SchemaLike = Joi.object()
    .keys({
      title: Joi.string().optional().allow(null),
      slug: Joi.string().required(),
      description: Joi.string().optional().allow(null),
      body: Joi.string().optional().allow(null),
    })
    .or('title', 'description', 'body')
    .required();

  async execute(
    params: UpdateArticleParams
  ): Promise<ArticleResponse | undefined> {
    const article = await Article.findOne({
      where: { slug: params.slug },
      relations: ['author'],
    });

    if (!article) throw new NotFoundError();
    if (article?.author_id !== this.context.userId) throw new ForbiddenError();

    article.title = params.title ?? article.title;
    article.description = params.description ?? article.description;
    article.body = params.body ?? article.body;

    await article.save();

    const { author } = article;

    const favorited = (author.favorites || []).some((a) => a.id === article.id);

    return mapArticleModelToArticleResponse({
      article,
      author,
      following: false,
      favorited,
    });
  }
}

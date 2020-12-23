import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { ForbiddenError, NotFoundError } from '../lib/errors';
import { ArticleResponse } from './Article.types';

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

    const article = await Article.findOne({ where: { slug: params.slug } });

    if (!article) throw new NotFoundError();
    if (article?.author.id !== this.context.userId) throw new ForbiddenError();

    article.title = params.title ?? article.title;
    article.description = params.description ?? article.description;
    article.body = params.body ?? article.body;

    await article.save();

    const { author } = article;

    return {
      title: article.title,
      description: article.description,
      body: article.body,
      favorited: false, // TODO: add
      favoritesCount: 0, // TODO: add
      tagList: article.tags.map((tag) => tag.title),
      createdAt: article.created_at.toISOString(),
      updatedAt: article.updated_at.toISOString(),
      author: {
        username: author.username,
        bio: author.bio,
        image: author.image,
        following: false,
      },
    };
  }
}
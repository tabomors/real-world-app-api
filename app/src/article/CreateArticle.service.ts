import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { Tag } from './Tag.entity';
import { User } from '../user/User.entity';
import { ForbiddenError } from '../lib/errors';
import { slugify } from '../lib/url';
import { ArticleResponse } from './Article.types';
import { mapArticleModelToArticleResponse } from './Article.mappers';

export type CreateArticleParams = {
  title: string;
  slug?: string;
  description?: string;
  body?: string;
  tagList?: string[];
};

export type CreateArticleContext = { userId: number };

export class CreateArticle extends ServiceBase<
  CreateArticleParams,
  ArticleResponse,
  CreateArticleContext
> {
  schema: Joi.SchemaLike = {
    title: Joi.string(),
    slug: Joi.string().allow(null),
    description: Joi.string().optional().allow(''),
    body: Joi.string().optional().allow(''),
    tagList: Joi.array().items(Joi.string()).allow(null),
  };

  async execute(
    params: CreateArticleParams
  ): Promise<ArticleResponse | undefined> {
    const article = new Article();
    article.title = params.title;
    article.slug = params.slug || slugify(params.title);
    article.description = params.description;
    article.body = params.body;
    article.author_id = this.context.userId;

    const tags = (params.tagList || []).map((tag) =>
      Tag.create({ title: tag })
    );
    await Tag.insert(tags);

    article.tags = tags;
    article.comments = [];

    await article.save();

    const user = await User.findOne({ where: { id: this.context.userId } });

    if (!user) throw new ForbiddenError();

    user.articles = (user.articles || []).concat(article);

    await user.save();

    return mapArticleModelToArticleResponse({
      article,
      author: user,
      favorited: false,
      following: false,
    });
  }
}

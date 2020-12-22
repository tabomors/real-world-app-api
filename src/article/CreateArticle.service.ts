import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { Tag } from './Tag.entity';
import { User } from '../user/User.entity';
import { ForbiddenError } from '../lib/errors';
import { slugify } from '../lib/url';

export type CreateArticleParams = {
  title: string;
  slug?: string;
  description?: string;
  body?: string;
  tagList?: string[];
};

export type CreateArticleResponse = {
  title: string;
  description?: string;
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: false;
  favoritesCount: 0;
  author: {
    username: string;
    bio?: string;
    image?: string;
    following: false;
  };
};

export type CreateArticleContext = { userId: number };

export class CreateArticle extends ServiceBase<
  CreateArticleParams,
  CreateArticleResponse,
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
  ): Promise<CreateArticleResponse | undefined> {
    const article = new Article();
    article.title = params.title;
    article.slug = params.slug || slugify(params.title);
    article.description = params.description;
    article.body = params.body;

    const tags = (params.tagList || []).map((tag) =>
      Tag.create({ title: tag })
    );
    await Tag.insert(tags);

    article.tags = tags;
    article.comments = [];

    await article.save();

    const user = await User.findOne({ where: { id: this.context.userId } })

    if (!user) throw new ForbiddenError();

    user.articles = (user.articles || []).concat(article);

    await user.save();

    return {
      title: article.title,
      description: article.description,
      body: article.body,
      favorited: false,
      favoritesCount: 0,
      tagList: article.tags.map((tag) => tag.title),
      createdAt: article.created_at.toISOString(),
      updatedAt: article.updated_at.toISOString(),
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
      },
    };
  }
}

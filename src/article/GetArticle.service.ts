import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from '../user/User.entity';
import { Article } from './Article.entity';
import { Subscription } from '../profile/Subscription.entity';
import { NotFoundError } from '../lib/errors';
import { ArticleResponse } from './Article.types';

export type GetArticleParams = {
  slug: string;
};

export type GetArticleContext = { userId?: string };

export class GetArticle extends ServiceBase<
  GetArticleParams,
  ArticleResponse,
  GetArticleContext
> {
  schema: Joi.SchemaLike = {
    slug: Joi.string(),
  };
  async execute(
    params: GetArticleParams
  ): Promise<ArticleResponse | undefined> {
    const article = await Article.findOne({
      where: { slug: params.slug },
    });


    if (!article) {
      throw new NotFoundError();
    }

    const currentUser = this.context.userId
      ? await User.findOne({ where: { id: this.context.userId } })
      : undefined;

    const following = currentUser?.id
      ? await Subscription.isFollowing(currentUser?.id, article.author.id)
      : false;

    return {
      title: article.title,
      description: article.description,
      body: article.body,
      favorited: false, // TODO: add
      favoritesCount: 0, // TODO: add
      tagList: (article.tags || []).map((tag) => tag.title),
      createdAt: article.created_at.toISOString(),
      updatedAt: article.updated_at.toISOString(),
      author: {
        username: article.author.username,
        bio: article.author.bio,
        image: article.author.image,
        following,
      },
    };
  }
}

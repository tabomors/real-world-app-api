import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { User } from '../user/User.entity';
import { Subscription } from '../profile/Subscription.entity';
import { Article } from './Article.entity';
import { ArticleResponse } from './Article.types';
import { NotFoundError, AuthFailedError } from '../lib/errors';
import { mapArticleModelToArticleResponse } from './Article.mappers';

export type UnfavoriteArticleParams = {
  slug: string;
};

export type UnfavoriteArticleContext = { userId: number };

export class UnfavoriteArticle extends ServiceBase<
  UnfavoriteArticleParams,
  ArticleResponse,
  UnfavoriteArticleContext
> {
  schema: Joi.SchemaLike = {
    slug: Joi.string().required(),
  };

  async execute(
    params: UnfavoriteArticleParams
  ): Promise<ArticleResponse | undefined> {
    const article = await Article.findOne({
      where: { slug: params.slug },
      relations: ['author'],
    });
    if (!article) throw new NotFoundError();

    const user = await User.findOne({
      where: { id: this.context.userId },
    });
    if (!user) throw new AuthFailedError();
    const following = await Subscription.isFollowing(
      this.context.userId,
      article.author_id
    );

    const isAlreadyFavorited = user.favorites?.some((a) => a.id === article.id);

    if (isAlreadyFavorited) {
      user.favorites = (user.favorites || []).filter(
        (a) => a.id !== article.id
      );
      await user.save();
      article.favorites_count -= 1;
      await article.save();
    }

    return mapArticleModelToArticleResponse({
      article,
      author: article.author,
      favorited: false,
      following,
    });
  }
}

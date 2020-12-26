import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { User } from '../user/User.entity';
import { Subscription } from '../profile/Subscription.entity';
import { ArticleResponse } from './Article.types';
import { mapArticleModelToArticleResponse } from './Article.mappers';

export type GetArticlesParams = {
  limit?: number;
  offset?: number;
  author?: string;
  favorited?: string;
  tag?: string;
};

export type GetArticlesResponse = {
  data: ArticleResponse[];
  count: number;
};

export type GetArticlesContext = { userId?: string };

export const emptyResults: GetArticlesResponse = { data: [], count: 0 };

export class GetArticles extends ServiceBase<
  GetArticlesParams,
  GetArticlesResponse,
  GetArticlesContext
> {
  schema: Joi.SchemaLike = {
    limit: Joi.number().optional().allow(null),
    offset: Joi.number().optional().allow(null),
    author: Joi.string().optional().allow(null),
    favorited: Joi.string().optional().allow(null),
    tag: Joi.string().optional().allow(null),
  };

  async fetchFollowingIds(): Promise<number[]> {
    const subscriptions = await Subscription.find({
      where: { user_id: this.context.userId },
    });
    return subscriptions.map((s) => s.following_id);
  }

  async fetchFavoritedIds(): Promise<number[]> {
    const user = this.context.userId
      ? await User.findOne({
          where: { id: this.context.userId },
        })
      : undefined;
    const favoritedArticles: Article[] = user?.favorites || [];
    return favoritedArticles.map((a) => a.id);
  }

  async execute(
    params: GetArticlesParams
  ): Promise<GetArticlesResponse | undefined> {
    const qb = await Article.createQueryBuilder('articles')
      .innerJoinAndSelect('articles.tags', 'tags')
      .innerJoinAndSelect('articles.author', 'author')
      .where('42 = 42'); // HACK: if we use where for each parameter latest where will override the prev one, so we need to use andWhere

    if (params.tag) {
      qb.andWhere('tags.title = :tag', { tag: params.tag });
    }

    if (params.author) {
      qb.andWhere('author.username = :username', { username: params.author });
    }

    // TODO: test it again
    if (params.favorited) {
      const author = await User.findOne({
        where: { username: params.favorited },
      });
      const favorites = (author?.favorites || []).map((a) => a.id);

      // NOTE: typeorm breaks on empty array
      if (favorites.length) {
        qb.andWhere('articles.id IN (:...ids)', {
          ids: favorites,
        });
      } else return emptyResults;
    }

    if (params.limit) {
      qb.limit(params.limit);
    }

    if (params.offset) {
      qb.offset(params.offset);
    }

    const [articles, count] = await qb.getManyAndCount();

    if (count === 0) return emptyResults;

    const followingIds = await this.fetchFollowingIds();
    const favoritedIds = await this.fetchFavoritedIds();

    return {
      data: articles.map((article) => {
        const favorited = favoritedIds.includes(article.id);
        const following = followingIds.includes(article.author.id);
        return mapArticleModelToArticleResponse({
          article,
          user: article.author,
          favorited,
          following,
        });
      }),
      count,
    };
  }
}

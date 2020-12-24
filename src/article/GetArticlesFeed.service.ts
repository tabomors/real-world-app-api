import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { Subscription } from '../profile/Subscription.entity';
import { ArticleResponse } from './Article.types';
import { User } from '../user/User.entity';

export type GetArticlesFeedParams = {
  limit?: number;
  offset?: number;
};

export type GetArticlesFeedResponse = {
  data: ArticleResponse[];
  count: number;
};

export type GetArticlesFeedContext = { userId: string };

const emptyResults: GetArticlesFeedResponse = { data: [], count: 0 };

export class GetArticlesFeed extends ServiceBase<
  GetArticlesFeedParams,
  GetArticlesFeedResponse,
  GetArticlesFeedContext
> {
  schema: Joi.SchemaLike = {
    limit: Joi.number().optional().allow(null),
    offset: Joi.number().optional().allow(null),
  };

  async fetchFavoritedIds(): Promise<number[]> {
    const user = await User.findOne({
      where: { id: this.context.userId },

    });
    const favoritedArticles: Article[] = user?.favorites || [];
    return favoritedArticles.map((a) => a.id);
  }

  async execute(
    params: GetArticlesFeedParams
  ): Promise<GetArticlesFeedResponse | undefined> {
    const subscriptions = await Subscription.find({
      where: { user_id: this.context.userId },
    });
    if (subscriptions.length === 0) return emptyResults;
    const followingIds = subscriptions.map((s) => s.following_id);
    const whereInput = followingIds.map((id) => ({ author: { id } }));
    const articles = await Article.find({
      where: whereInput,
      take: params.limit,
      skip: params.offset,
      relations: ['author']
    });
    if (articles.length === 0) return emptyResults;
    const favoritedIds = await this.fetchFavoritedIds();

    return {
      data: articles.map((a) => {
        const favorited = favoritedIds.includes(a.id);

        return {
          author: {
            following: true,
            username: a.author.username,
            bio: a.author.bio,
            image: a.author.image,
          },
          createdAt: a.created_at.toISOString(),
          updatedAt: a.updated_at.toISOString(),
          favorited,
          favoritesCount: a.favorites_count,
          tagList: a.tags.map((t) => t.title),
          title: a.title,
          body: a.body,
          description: a.description,
        };
      }),
      count: articles.length,
    };
  }
}

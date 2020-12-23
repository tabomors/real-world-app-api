import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { Subscription } from '../profile/Subscription.entity';
import { ArticleResponse } from './Article.types';

export type GetArticlesFeedParams = {
  limit?: number;
  offset?: number;
};

export type GetArticleFeedResponse = {
  data: ArticleResponse[];
  count: number;
};

export type GetArticlesFeedContext = { userId: string };

const emptyResults: GetArticleFeedResponse = { data: [], count: 0 };

export class GetArticlesFeed extends ServiceBase<
  GetArticlesFeedParams,
  GetArticleFeedResponse,
  GetArticlesFeedContext
> {
  schema: Joi.SchemaLike = {
    limit: Joi.number().optional().allow(null),
    offset: Joi.number().optional().allow(null),
  };
  async execute(
    params: GetArticlesFeedParams
  ): Promise<GetArticleFeedResponse | undefined> {
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
    });
    if (articles.length === 0) return emptyResults;
    // TODO: add some sort of mappers?
    return {
      data: articles.map((a) => ({
        author: {
          following: true,
          username: a.author.username,
          bio: a.author.bio,
          image: a.author.image,
        },
        createdAt: a.created_at.toISOString(),
        updatedAt: a.updated_at.toISOString(),
        favorited: false, // TODO: add
        favoritesCount: 0, // TODO: add,
        tagList: a.tags.map((t) => t.title),
        title: a.title,
        body: a.body,
        description: a.description,
      })),
      count: articles.length,
    };
  }
}

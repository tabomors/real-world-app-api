import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Article } from './Article.entity';
import { Subscription } from '../profile/Subscription.entity';
import { ArticleResponse } from './Article.types';

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

export type GetArticlesContext = { userId: string };

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

    if (params.favorited) {
      // TODO: add
    }

    if (params.limit) {
      qb.limit(params.limit);
    }

    if (params.offset) {
      qb.offset(params.offset);
    }

    const [articles, count] = await qb.getManyAndCount();

    let followingIds: number[] = [];
    if (count !== 0) {
      const subscriptions = await Subscription.find({
        where: { user_id: this.context.userId },
      });
      followingIds = subscriptions.map((s) => s.following_id);
    }

    return {
      data: articles.map((a) => ({
        author: {
          following: followingIds.includes(a.author.id),
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
      count,
    };
  }
}

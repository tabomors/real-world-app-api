import { Request, Response } from 'express';
import {
  GetArticlesFeed,
  GetArticlesFeedParams,
} from './GetArticlesFeed.service';
import { buildErrorResponseBody } from '../lib/errors';
import { parseNumberLikeQP } from '../lib/url';

export const getArticlesFeed = async (req: Request, res: Response) => {
  try {
    const getArticlesFeed = new GetArticlesFeed({
      userId: res.locals.userId,
    });

    const limit = parseNumberLikeQP(req.query.limit as string);
    const offset = parseNumberLikeQP(req.query.offset as string);

    const data = await getArticlesFeed.run<GetArticlesFeedParams>({
      limit,
      offset
    });

    res.status(200).send({ articles: data?.data, articlesCount: data?.count });
  } catch (e) {
    res.status(422).send(buildErrorResponseBody([e.name]));
  }
};

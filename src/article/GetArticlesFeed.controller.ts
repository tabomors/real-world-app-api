import { Request, Response } from 'express';
import {
  GetArticlesFeed,
  GetArticlesFeedParams,
} from './GetArticlesFeed.service';
import { buildErrorResponseBody } from '../lib/errors';

export const getArticlesFeed = async (req: Request, res: Response) => {
  try {
    const getArticlesFeed = new GetArticlesFeed({
      userId: res.locals.userId,
    });

    // TODO: move to helper
    const parsedLimit = parseInt(req.query.limit?.toString() || '', 10);
    const limit = isNaN(parsedLimit) ? undefined : parsedLimit;
    const parsedOffset = parseInt(req.query.offset?.toString() || '', 10);
    const offset = isNaN(parsedOffset) ? undefined : parsedOffset;

    const data = await getArticlesFeed.run<GetArticlesFeedParams>({
      limit,
      offset
    });

    res.status(200).send({ articles: data?.data, articlesCount: data?.count });
  } catch (e) {
    res.status(422).send(buildErrorResponseBody([e.name]));
  }
};

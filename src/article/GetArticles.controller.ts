import { Request, Response } from 'express';
import { GetArticles, GetArticlesParams } from './GetArticles.service';
import { buildErrorResponseBody } from '../lib/errors';

export const getArticles = async (req: Request, res: Response) => {
  try {
    const getArticles = new GetArticles({
      userId: res.locals.userId,
    });

    // TODO: move to helper
    const parsedLimit = parseInt(req.query.limit?.toString() || '', 10);
    const limit = isNaN(parsedLimit) ? undefined : parsedLimit;
    const parsedOffset = parseInt(req.query.offset?.toString() || '', 10);
    const offset = isNaN(parsedOffset) ? undefined : parsedOffset;

    const data = await getArticles.run<GetArticlesParams>({
      limit,
      offset,
      author: req.query.author as string,
      favorited: req.query.favorited as string,
      tag: req.query.tag as string,
    });

    res.status(200).send({ articles: data?.data, articlesCount: data?.count });
  } catch (e) {
    res.status(422).send(buildErrorResponseBody([e.name]));
  }
};

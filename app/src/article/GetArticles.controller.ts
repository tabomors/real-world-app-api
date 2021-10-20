import { Request, Response } from 'express';
import { GetArticles, GetArticlesParams } from './GetArticles.service';
import { buildErrorResponseBody } from '../lib/errors';
import { parseNumberLikeQP } from '../lib/url';

export const getArticles = async (req: Request, res: Response) => {
  try {
    const getArticles = new GetArticles({
      userId: res.locals.userId,
    });

    const limit = parseNumberLikeQP(req.query.limit as string);
    const offset = parseNumberLikeQP(req.query.offset as string);

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

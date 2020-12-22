import { Request, Response } from 'express';
import { GetArticle, GetArticleParams } from './GetArticle.service';
import { buildErrorResponseBody, NotFoundError } from '../lib/errors';

export const getArticle = async (req: Request, res: Response) => {
  const getArticleService = new GetArticle({ userId: res.locals.userId });

  try {
    const data = await getArticleService.run<GetArticleParams>({
      slug: req.params.slug,
    });

    res.status(201).send({ article: data });
  } catch (e) {
    if (e instanceof NotFoundError) {
      res.sendStatus(404);
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

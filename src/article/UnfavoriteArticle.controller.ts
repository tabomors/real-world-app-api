import { Request, Response } from 'express';
import {
  UnfavoriteArticle,
  UnfavoriteArticleParams,
} from './UnfavoriteArticle.service';
import {
  buildErrorResponseBody,
  NotFoundError,
  AuthFailedError,
} from '../lib/errors';

export const unfavoriteArticle = async (req: Request, res: Response) => {
  try {
    const unfavoriteArticleService = new UnfavoriteArticle({
      userId: res.locals.userId,
    });

    const data = await unfavoriteArticleService.run<UnfavoriteArticleParams>({
      slug: req.params.slug,
    });

    res.status(200).send({ article: data });
  } catch (e) {
    if (e instanceof NotFoundError) {
      res.sendStatus(404);
    } else if (e instanceof AuthFailedError) {
      res.sendStatus(401);
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

import { Request, Response } from 'express';
import { FavoriteArticle, FavoriteArticleParams } from './FavoriteArticle.service';
import {
  buildErrorResponseBody,
  NotFoundError,
  AuthFailedError,
} from '../lib/errors';

export const favoriteArticle = async (req: Request, res: Response) => {
  try {
    const favoriteArticleService = new FavoriteArticle({
      userId: res.locals.userId,
    });

    const data = await favoriteArticleService.run<FavoriteArticleParams>({
      slug: req.params.slug
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

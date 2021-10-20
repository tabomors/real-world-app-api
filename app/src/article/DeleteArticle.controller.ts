import { Request, Response } from 'express';
import { DeleteArticle, DeleteArticleParams } from './DeleteArticle.service';
import {
  buildErrorResponseBody,
  NotFoundError,
  ForbiddenError,
} from '../lib/errors';

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const updateUserService = new DeleteArticle({ userId: res.locals.userId });

    await updateUserService.run<DeleteArticleParams>({
      slug: req.params.slug
    });

    res.sendStatus(200);
  } catch (e) {
    if (e instanceof NotFoundError) {
      res.sendStatus(404);
    } else if (e instanceof ForbiddenError) {
      res.sendStatus(403);
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

import { Request, Response } from 'express';
import { UpdateArticle, UpdateArticleParams } from './UpdateArticle.service';
import { buildErrorResponseBody, NotFoundError, ForbiddenError } from '../lib/errors';

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const updateArticleService = new UpdateArticle({ userId: res.locals.userId });
    const { article } = req.body;
    const data = await updateArticleService.run<UpdateArticleParams>({
      slug: req.params.slug,
      body: article.body,
      description: article.description,
      title: article.title
    });

    res.status(200).send({ article: data });
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

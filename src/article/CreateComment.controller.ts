import { Request, Response } from 'express';
import { CreateComment, CreateCommentParams } from './CreateComment.service';
import {
  buildErrorResponseBody,
  AuthFailedError,
  NotFoundError,
} from '../lib/errors';

export const createComment = async (req: Request, res: Response) => {
  const createCommentService = new CreateComment({ userId: res.locals.userId });

  try {
    const data = await createCommentService.run<CreateCommentParams>({
      slug: req.params.slug,
      body: req.body.comment.body,
    });

    res.status(201).send({ comment: data });
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

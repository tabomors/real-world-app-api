import { Request, Response } from 'express';
import { DeleteComment, DeleteCommentParams } from './DeleteComment.service';
import {
  buildErrorResponseBody,
  NotFoundError,
  ForbiddenError,
} from '../lib/errors';

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const deleteCommentService = new DeleteComment({ userId: res.locals.userId });

    await deleteCommentService.run<DeleteCommentParams>({
      slug: req.params.slug,
      id: req.params.id
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

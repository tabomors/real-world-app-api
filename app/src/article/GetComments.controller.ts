import { Request, Response } from 'express';
import { GetComments, GetCommentsParams } from './GetComments.service';
import { buildErrorResponseBody, NotFoundError } from '../lib/errors';

export const getComments = async (req: Request, res: Response) => {
  try {
    const getComments = new GetComments({
      userId: res.locals.userId,
    });

    const data = await getComments.run<GetCommentsParams>({
      slug: req.params.slug,
    });

    res.status(200).send({ comments: data?.data });
  } catch (e) {
    if (e instanceof NotFoundError) {
      res.sendStatus(404);
    } else res.status(422).send(buildErrorResponseBody([e.name]));
  }
};

import { Response } from 'express';
import { GetUser } from './GetUser.service';
import { AuthFailedError, buildErrorResponseBody } from '../lib/errors';

export const getUser = async (_: any, res: Response) => {
  try {
    const getUserService = new GetUser({ userId: res.locals.userId });
    const data = await getUserService.run(undefined);
    res.status(200).send({ user: data });
  } catch (e) {
    if (e instanceof AuthFailedError) {
      res.sendStatus(401);
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

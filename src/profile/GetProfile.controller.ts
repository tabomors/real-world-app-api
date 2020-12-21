import { Request, Response } from 'express';
import { GetProfileParams, GetUser } from './GetProfile.service';
import { AuthFailedError, buildErrorResponseBody } from '../lib/errors';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const getUserService = new GetUser({ userId: res.locals.userId });
    const data = await getUserService.run<GetProfileParams>({
      username: req.params.username,
    });
    res.status(200).send({ profile: data });
  } catch (e) {
    if (e instanceof AuthFailedError) {
      res.sendStatus(401);
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

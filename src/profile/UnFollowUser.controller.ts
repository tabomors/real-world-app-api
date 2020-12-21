import { Request, Response } from 'express';
import { AuthFailedError, buildErrorResponseBody } from '../lib/errors';
import { UnFollowUser, UnFollowUserParams } from './UnFollowUser.service';

export const unFollowUser = async (req: Request, res: Response) => {
  try {
    const followUserService = new UnFollowUser({ userId: res.locals.userId });
    const data = await followUserService.run<UnFollowUserParams>({
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

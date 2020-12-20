import { Request, Response } from 'express';
import { UpdateUser, UpdateUserParams } from './UpdateUser.service';
import { AuthFailedError, buildErrorResponseBody } from '../lib/errors';

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updateUserService = new UpdateUser({ userId: res.locals.userId });

    const data = await updateUserService.run<UpdateUserParams>({
      email: req.body.user.email,
      username: req.body.user.username,
      bio: req.body.user.bio,
      image: req.body.user.image,
    });

    res.status(200).send({ user: data });
  } catch (e) {
    console.log('error', e);
    if (e instanceof AuthFailedError) {
      res.sendStatus(401);
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

import { Request, Response } from 'express';
import { LoginUser, LoginUserParams } from './LoginUser.service';
import { AuthFailedError, buildErrorResponseBody } from '../lib/errors';

export const loginUser = async (req: Request, res: Response) => {
  const loginUserService = new LoginUser({});
  const { user } = req.body;

  try {
    const data = await loginUserService.run<LoginUserParams>({
      email: user.email,
      password: user.password
    });

    res.status(201).send({ user: data });
  } catch (e) {
    if (AuthFailedError.isAuthFailedError(e)) {
      res.sendStatus(401);
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

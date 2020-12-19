import { Request, Response } from 'express';
import { CreateUser } from './CreateUser.service';
import { NotUniqError, buildErrorResponseBody } from '../lib/errors';

export const create = async (req: Request, res: Response) => {
  const createUserService = new CreateUser({});
  const { user } = req.body;

  try {
    const data = await createUserService.run<{
      email: string;
      username: string;
      password: string;
    }>({ email: user.email, username: user.username, password: user.password });

    res.status(201).send({ user: data });
  } catch (e) {
    if (NotUniqError.isNotUniqError(e)) {
      res.status(422).send(buildErrorResponseBody([e.name]));
    } else {
      res.status(500).send(buildErrorResponseBody([e.name]));
    }
  }
};

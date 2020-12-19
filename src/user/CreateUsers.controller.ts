import { Request, Response } from 'express';
import { CreateUser, CreateUserParams } from './CreateUser.service';
import { NotUniqError, buildErrorResponseBody } from '../lib/errors';

export const createUser = async (req: Request, res: Response) => {
  const createUserService = new CreateUser({});
  const { user } = req.body;

  try {
    const data = await createUserService.run<CreateUserParams>({
      email: user.email,
      username: user.username,
      password: user.password,
    });

    res.status(201).send({ user: data });
  } catch (e) {
    if (NotUniqError.isNotUniqError(e)) {
      res.status(422).send(buildErrorResponseBody([e.name]));
    } else {
      res.status(422).send(buildErrorResponseBody([e.name]));
    }
  }
};

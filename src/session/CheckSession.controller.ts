import { Request, Response, NextFunction } from 'express';
import { AuthFailedError, isValidationError } from '../lib/errors';
import { CheckSession, GetUserAuthParams } from './CheckSession.service';

export const checkSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkSessionService = new CheckSession({});
    const data = await checkSessionService.run<GetUserAuthParams>({
      token: req.headers.authorization,
    });
    res.locals.userId = data?.userId;
    return next();
  } catch (e) {
    if (e instanceof AuthFailedError || isValidationError(e)) {
      res.sendStatus(401);
    }
    res.sendStatus(500);
  }
};

import { Request, Response, NextFunction } from 'express';
import { AuthFailedError, isValidationError } from '../lib/errors';
import { CheckSession, GetUserAuthParams } from './CheckSession.service';

const extractTokenData = (token: string) => token.replace(/Bearer /, '');

export const checkSession = (optional = false) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization ? extractTokenData(req.headers.authorization) : undefined;
    const checkSessionService = new CheckSession({});
    const data = await checkSessionService.run<GetUserAuthParams>({
      token,
      optional,
    });
    res.locals.userId = data?.userId;
    return next();
  } catch (e) {
    if (e instanceof AuthFailedError || isValidationError(e)) {
      return res.sendStatus(401);
    }
    return res.sendStatus(500);
  }
};

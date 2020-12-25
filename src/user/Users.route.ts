import { Router } from 'express';
import { createUser } from './CreateUser.controller';
import { loginUser } from './LoginUser.controller';
import { checkSession } from '../session/CheckSession.controller';
import { getUser } from './GetUser.controller';
import { updateUser } from './UpdateUser.controller'

export const manyUsersRoutes = Router();

manyUsersRoutes.post('/', createUser);
manyUsersRoutes.post('/login', loginUser);

export const oneUserRoutes = Router();

oneUserRoutes.get('/', checkSession(), getUser);
oneUserRoutes.put('/', checkSession(), updateUser);


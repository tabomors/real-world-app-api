import { Router } from 'express';
import { createUser } from './CreateUser.controller';
import { loginUser } from './LoginUser.controller';
import { checkSession } from '../session/CheckSession.controller';
import { getUser } from './GetUser.controller';
import { updateUser } from './UpdateUser.controller'

const router = Router();

router.post('/', createUser);
router.get('/', checkSession(), getUser);
router.put('/', checkSession(), updateUser);
router.post('/login', loginUser);

export default router;

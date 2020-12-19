import { Router } from 'express';
import { createUser } from './CreateUsers.controller';
import { loginUser } from './LoginUser.controller';

const router = Router();

router.post('/', createUser);
router.post('/login', loginUser)

export default router;

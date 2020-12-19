import { Router } from 'express';
import { create } from './Users.controller';

const router = Router();

router.post('/', create);

export default router;

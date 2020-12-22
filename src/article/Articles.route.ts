
import { Router } from 'express';
import { checkSession } from '../session/CheckSession.controller';
import { createArticle } from './CreateArticle.controller';

const router = Router();

router.post('/', checkSession(), createArticle);

export default router;

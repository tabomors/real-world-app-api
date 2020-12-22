
import { Router } from 'express';
import { checkSession } from '../session/CheckSession.controller';
import { createArticle } from './CreateArticle.controller';
import { getArticle } from './GetArticle.controller';

const router = Router();

router.post('/', checkSession(), createArticle);
router.get('/:slug', checkSession(true), getArticle);

export default router;

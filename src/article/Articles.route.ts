
import { Router } from 'express';
import { checkSession } from '../session/CheckSession.controller';
import { createArticle } from './CreateArticle.controller';
import { getArticle } from './GetArticle.controller';
import { updateArticle } from './UpdateArticle.controller';

const router = Router();

router.post('/', checkSession(), createArticle);
router.get('/:slug', checkSession(true), getArticle);
router.put('/:slug', checkSession(), updateArticle);

export default router;

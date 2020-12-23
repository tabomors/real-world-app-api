
import { Router } from 'express';
import { checkSession } from '../session/CheckSession.controller';
import { createArticle } from './CreateArticle.controller';
import { getArticle } from './GetArticle.controller';
import { updateArticle } from './UpdateArticle.controller';
import { deleteArticle } from './DeleteArticle.controller';
import { getArticlesFeed } from './GetArticlesFeed.controller';

const router = Router();

router.post('/', checkSession(), createArticle);
router.get('/feed', checkSession(), getArticlesFeed);
router.get('/:slug', checkSession(true), getArticle);
router.put('/:slug', checkSession(), updateArticle);
router.delete('/:slug', checkSession(), deleteArticle);

export default router;

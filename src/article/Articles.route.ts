
import { Router } from 'express';
import { checkSession } from '../session/CheckSession.controller';
import { createArticle } from './CreateArticle.controller';
import { getArticle } from './GetArticle.controller';
import { updateArticle } from './UpdateArticle.controller';
import { deleteArticle } from './DeleteArticle.controller';
import { getArticlesFeed } from './GetArticlesFeed.controller';
import { getArticles } from './GetArticles.controller';
import { createComment } from './CreateComment.controller';
import { getComments } from './GetComments.controller';

const router = Router();

router.post('/', checkSession(), createArticle);
router.get('/', checkSession(true), getArticles);
router.get('/feed', checkSession(), getArticlesFeed);

router.get('/:slug', checkSession(true), getArticle);
router.put('/:slug', checkSession(), updateArticle);
router.delete('/:slug', checkSession(), deleteArticle);

router.get('/:slug/comments', checkSession(true), getComments);
router.post('/:slug/comments', checkSession(), createComment);

export default router;

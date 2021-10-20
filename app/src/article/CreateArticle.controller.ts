import { Request, Response } from 'express';
import { CreateArticle, CreateArticleParams } from './CreateArticle.service';
import { buildErrorResponseBody } from '../lib/errors';

export const createArticle = async (req: Request, res: Response) => {
  const createArticleService = new CreateArticle({ userId: res.locals.userId });
  const { article } = req.body;

  try {
    const data = await createArticleService.run<CreateArticleParams>({
      title: article.title,
      body: article.body,
      description: article.description,
      slug: article.slug,
      tagList: article.tagList,
    });

    res.status(201).send({ article: data });
  } catch (e) {
    res.status(422).send(buildErrorResponseBody([e.name]));
  }
};

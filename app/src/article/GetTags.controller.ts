import { Request, Response } from 'express';
import { GetTags } from './GetTags.service';
import { buildErrorResponseBody } from '../lib/errors';

export const getTags = async (req: Request, res: Response) => {
  try {
    const getTagsService = new GetTags({});
    const data = await getTagsService.run({});
    res.status(200).send({ tags: data?.data });
  } catch (e) {
    res.status(422).send(buildErrorResponseBody([e.name]));
  }
};

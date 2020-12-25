import { ServiceBase } from '../lib/ServiceBase';
import * as Joi from 'joi';
import { Tag } from './Tag.entity';

export type GetTagsResponse = {
  data: string[];
};

export class GetTags extends ServiceBase<any, GetTagsResponse, any> {
  schema: Joi.SchemaLike = Joi.any();
  async execute(): Promise<GetTagsResponse | undefined> {
    const tags = await Tag.createQueryBuilder('tags')
      .select('DISTINCT ("title")')
      .getRawMany();
    return { data: tags.map((t) => t.title) };
  }
}

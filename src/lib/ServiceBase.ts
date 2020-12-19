import * as Joi from 'joi';
import { ValidationError } from './errors';

// TODO: describe template method pattern
export abstract class ServiceBase<
  TCleanParamsAfterValidation extends Record<string, unknown>,
  TSafeDataToSend extends Record<string, unknown>,
  TContext extends Record<string, unknown>
> {
  context: TContext;

  constructor(context: TContext) {
    this.context = context;
  }

  schema!: Joi.SchemaLike;

  validate<TParams>(
    params: TParams
  ): { value: TCleanParamsAfterValidation; error?: ValidationError } {
    const compiledSchema = Joi.compile(this.schema);
    const { error, value } = compiledSchema.validate(params);

    return { value, error };
  }

  abstract execute(
    params: TCleanParamsAfterValidation
  ): Promise<TSafeDataToSend | undefined>;

  // TODO: research how to add types if method throws
  async run<TParams>(params: TParams): Promise<TSafeDataToSend | undefined> {
    const { error, value } = this.validate(params);
    if (error) {
      throw error;
    }
    return await this.execute(value);
  }
}

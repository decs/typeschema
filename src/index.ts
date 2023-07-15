import type {InferInput, InferOutput} from './registry';
import type {ValidationIssue} from './schema';

import {wrap, wrapCached} from './wrap';

export type {InferInput, InferOutput};
export type {ValidationIssue} from './schema';

export type Infer<TSchema> = InferOutput<TSchema>;

export async function validate<
  TSchema extends TypeSchemaRegistry[keyof TypeSchemaRegistry]['base'],
>(
  schema: TSchema,
  data: unknown,
): Promise<{data: InferOutput<TSchema>} | {issues: Array<ValidationIssue>}> {
  const wrappedSchema = wrapCached(schema) ?? (await wrap(schema));
  return wrappedSchema.validate(data);
}

export async function assert<
  TSchema extends TypeSchemaRegistry[keyof TypeSchemaRegistry]['base'],
>(schema: TSchema, data: unknown): Promise<InferOutput<TSchema>> {
  const result = await validate(schema, data);
  if ('issues' in result) {
    throw result.issues[0];
  }
  return result.data;
}

import type {Schema} from './registry';
import type {InferOutput} from './resolver';
import type {ValidationIssue} from './schema';
import type {IfDefined} from './utils';

import {wrap, wrapCached} from './wrap';

export type {Schema} from './registry';
export type {ValidationIssue} from './schema';

export type Infer<TSchema extends Schema> = Schema extends TSchema
  ? TSchema extends Schema<infer T>
    ? T
    : never
  : {
      [K in keyof TypeSchemaRegistry]: IfDefined<
        InferOutput<TypeSchemaRegistry[K], TSchema>
      >;
    }[keyof TypeSchemaRegistry];

export async function validate<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<{data: Infer<TSchema>} | {issues: Array<ValidationIssue>}> {
  const wrappedSchema = wrapCached(schema) ?? (await wrap(schema));
  return wrappedSchema.validate(data);
}

export async function assert<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<Infer<TSchema>> {
  const result = await validate(schema, data);
  if ('issues' in result) {
    throw result.issues[0];
  }
  return result.data;
}

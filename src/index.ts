import type {InferOutput} from './resolver';
import type {Schema, TypeSchema, ValidationIssue} from './schema';
import type {IfDefined} from './utils';

import {wrap as wrapUncached, wrapCached} from './wrap';

export type {Schema, TypeSchema, ValidationIssue} from './schema';

export type Infer<TSchema extends Schema> = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    InferOutput<TypeSchemaRegistry[K], TSchema>
  >;
}[keyof TypeSchemaRegistry];

export async function wrap<TSchema extends Schema>(
  schema: TSchema,
): Promise<TypeSchema<Infer<TSchema>>> {
  return wrapCached(schema) ?? (await wrapUncached(schema));
}

export async function validate<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<{data: Infer<TSchema>} | {issues: Array<ValidationIssue>}> {
  const wrappedSchema = wrapCached(schema) ?? (await wrapUncached(schema));
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

import './adapters';

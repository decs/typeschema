import type {Schema} from './schema';
import type {TKind, TSchema as TypeBoxSchema} from '@sinclair/typebox';
import type {
  FromSchema,
  JSONSchema as ActualJSONSchema,
} from 'json-schema-to-ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IfDefined<T> = any extends T ? never : T;

export async function maybe<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch (_e) {
    return undefined;
  }
}

export function isTypeBoxSchema(schema: Schema): schema is TypeBoxSchema {
  return Symbol.for('TypeBox.Kind') in schema;
}

export type JSONSchema = Exclude<ActualJSONSchema, boolean>;

export type FromJSONSchema<TSchema extends JSONSchema> =
  TSchema extends IfDefined<TKind> ? never : FromSchema<TSchema>;

export function isJSONSchema(schema: Schema): schema is JSONSchema {
  return (
    typeof schema === 'object' &&
    !('validate' in schema) &&
    !('parse' in schema) &&
    !isTypeBoxSchema(schema)
  );
}

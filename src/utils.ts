import type {Schema} from './schema';
import type {TSchema} from '@sinclair/typebox';
import type {SchemaObject} from 'ajv';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IfDefined<T> = any extends T ? never : T;

export type UnknownIfNever<T> = [T] extends [never] ? unknown : T;

export function isTypeBoxSchema(schema: Schema): schema is TSchema {
  return Symbol.for('TypeBox.Kind') in schema;
}

export function isJSONSchema(schema: Schema): schema is SchemaObject {
  return (
    typeof schema === 'object' &&
    !('validate' in schema) &&
    !('parse' in schema) &&
    !('kind' in schema) &&
    !isTypeBoxSchema(schema)
  );
}

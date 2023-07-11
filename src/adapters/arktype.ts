import type {Schema, TypeSchema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
import type {Problems, Type} from 'arktype';

import {register} from '../registry';
import {maybe} from '../utils';

type ArkTypeSchema<T> = Type<T>;

interface ArkTypeResolver extends TypeSchemaResolver {
  base: ArkTypeSchema<this['type']>;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
  error: Problems;
}

async function wrap<T>(schema: Schema<T>): Promise<TypeSchema<T> | null> {
  const ArkType = await maybe(() => import('arktype'));
  if (ArkType == null) {
    return null;
  }
  if (!('infer' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies ArkTypeSchema<T>;
  return {
    assert: async data => schema.assert(data) as T,
  };
}

declare global {
  export interface TypeSchemaRegistry {
    arktype: ArkTypeResolver;
  }
}
register(wrap);

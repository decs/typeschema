import type {Schema} from '../registry';
import type {InferSchema, TypeSchemaResolver} from '../resolver';
import type {Problems, Type} from 'arktype';

import {register} from '../registry';
import {maybe} from '../utils';

interface ArkTypeResolver extends TypeSchemaResolver {
  base: Type<this['type']>;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
  error: Problems;
}

declare global {
  export interface TypeSchemaRegistry {
    arktype: ArkTypeResolver;
  }
}

register(async <T>(schema: Schema<T>) => {
  const ArkType = await maybe(() => import('arktype'));
  if (ArkType == null) {
    return null;
  }
  if (!('infer' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies InferSchema<ArkTypeResolver, T>;
  return {
    assert: async data => schema.assert(data) as T,
  };
});

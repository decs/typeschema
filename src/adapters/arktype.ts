import type {Schema, WrappedSchema} from './adapter-registry';
import type {TypeSchemaResolver} from './type-resolver';
import type {Problems, Type} from 'arktype';

import {maybe} from '../utils';
import {registerAdapter} from './adapter-registry';

type ArkTypeSchema<T> = Type<T>;

declare global {
  export interface SchemaAdapterRegistry {
    aktype: ArkTypeResolver;
  }
}

interface ArkTypeResolver extends TypeSchemaResolver {
  base: ArkTypeSchema<this['type']>;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
  error: Problems;
}

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
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

registerAdapter(wrap);

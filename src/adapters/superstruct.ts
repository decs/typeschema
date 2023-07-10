import type {Schema, WrappedSchema} from './adapter-registry';
import type {TypeSchemaResolver} from './type-resolver';
import type {Infer, Struct, StructError} from 'superstruct';

import {maybe} from '../utils';
import {registerAdapter} from './adapter-registry';

type SuperStructSchema<T> = Struct<T>;

declare global {
  export interface SchemaAdapterRegistry {
    superstruct: SuperstructResolver;
  }
}

interface SuperstructResolver extends TypeSchemaResolver {
  base: SuperStructSchema<this['type']>;
  input: this['schema'] extends Struct ? Infer<this['schema']> : never;
  output: this['schema'] extends Struct ? Infer<this['schema']> : never;
  error: StructError;
}

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
  const Superstruct = await maybe(() => import('superstruct'));
  if (Superstruct == null) {
    return null;
  }
  if (!('refiner' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies SuperStructSchema<T>;
  return {
    assert: async data => schema.create(data),
  };
}

registerAdapter(wrap);

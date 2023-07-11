import type {Schema, TypeSchema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
import type {Infer, Struct, StructError} from 'superstruct';

import {register} from '../registry';
import {maybe} from '../utils';

type SuperStructSchema<T> = Struct<T>;

interface SuperstructResolver extends TypeSchemaResolver {
  base: SuperStructSchema<this['type']>;
  input: this['schema'] extends Struct ? Infer<this['schema']> : never;
  output: this['schema'] extends Struct ? Infer<this['schema']> : never;
  error: StructError;
}

async function wrap<T>(schema: Schema<T>): Promise<TypeSchema<T> | null> {
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

declare global {
  export interface TypeSchemaRegistry {
    superstruct: SuperstructResolver;
  }
}
register(wrap);

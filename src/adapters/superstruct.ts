import type {TypeSchemaResolver} from '../resolver';
import type {Infer, Struct, StructError} from 'superstruct';

import {register} from '../registry';
import {maybe} from '../utils';

interface SuperstructResolver extends TypeSchemaResolver {
  base: Struct<this['type']>;
  input: this['schema'] extends Struct ? Infer<this['schema']> : never;
  output: this['schema'] extends Struct ? Infer<this['schema']> : never;
  error: StructError;
}

declare global {
  export interface TypeSchemaRegistry {
    superstruct: SuperstructResolver;
  }
}

register<'superstruct'>(
  async schema => {
    const Superstruct = await maybe(() => import('superstruct'));
    if (Superstruct == null) {
      return null;
    }
    if (!('refiner' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  schema => ({
    assert: async data => schema.create(data),
  }),
);

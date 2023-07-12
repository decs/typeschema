import type {TypeSchemaResolver} from '../resolver';
import type {Infer, Struct, StructError} from 'superstruct';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
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
    validate: async data => {
      const result = schema.validate(data);
      if (result[0] == null) {
        return {data: result[1]};
      }
      const {message, path} = result[0];
      return {issues: [new ValidationIssue(message, path)]};
    },
  }),
);

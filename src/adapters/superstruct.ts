import type {TypeSchemaResolver} from '../resolver';
import type {Infer, Struct, StructError} from 'superstruct';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {maybe} from '../utils';

interface SuperstructResolver extends TypeSchemaResolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed for assignability
  base: Struct<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed to match any base schema
  input: this['schema'] extends Struct<any, any>
    ? Infer<this['schema']>
    : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed to match any base schema
  output: this['schema'] extends Struct<any, any>
    ? Infer<this['schema']>
    : never;
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
      const result = schema.validate(data, {coerce: true});
      if (result[0] == null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed because schema can't be resolved to a specific type
        return {data: result[1] as any};
      }
      const {message, path} = result[0];
      return {issues: [new ValidationIssue(message, path)]};
    },
  }),
);

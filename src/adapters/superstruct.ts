import type {Resolver} from '../resolver';
import type {Infer, Struct} from 'superstruct';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface SuperstructResolver extends Resolver {
  base: Struct<this['type']>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: this['schema'] extends Struct<any, any>
    ? Infer<this['schema']>
    : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends Struct<any, any>
    ? Infer<this['schema']>
    : never;
}

declare global {
  export interface TypeSchemaRegistry {
    superstruct: SuperstructResolver;
  }
}

register<'superstruct'>(
  schema =>
    'refiner' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
      ? schema
      : null,
  async schema => ({
    validate: async data => {
      const result = schema.validate(data, {coerce: true});
      if (result[0] == null) {
        return {data: result[1]};
      }
      const {message, path} = result[0];
      return {issues: [new ValidationIssue(message, path)]};
    },
  }),
  () => import('superstruct'),
);

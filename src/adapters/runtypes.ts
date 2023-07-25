import type {Resolver} from '../resolver';
import type {Runtype, Static} from 'runtypes';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface RuntypesResolver extends Resolver {
  base: Runtype<this['type']>;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
}

declare global {
  export interface TypeSchemaRegistry {
    runtypes: RuntypesResolver;
  }
}

register<'runtypes'>(
  schema =>
    'reflect' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
      ? schema
      : null,
  async schema => ({
    validate: async data => {
      const result = schema.validate(data);
      if (result.success) {
        return {data: result.value};
      }
      return {issues: [new ValidationIssue(result.message)]};
    },
  }),
  'runtypes',
);

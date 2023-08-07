import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Runtype, Static} from 'runtypes';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface RuntypesResolver extends Resolver {
  base: Runtype<this['type']>;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
}

export const coerce: Adapter<'runtypes'>['coerce'] = schema =>
  'reflect' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'runtypes'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    return async data => {
      const result = coercedSchema.validate(data);
      if (result.success) {
        return {data: result.value};
      }
      return {issues: [new ValidationIssue(result.message)]};
    };
  };

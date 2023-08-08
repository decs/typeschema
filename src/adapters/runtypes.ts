import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {Runtype, Static} from 'runtypes';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface RuntypesResolver extends Resolver {
  base: Runtype<this['type']>;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
}

const coerce: Coerce<'runtypes'> = fn => schema =>
  'reflect' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema => async (data: unknown) => {
    const result = schema.validate(data);
    if (result.success) {
      return {data: result.value};
    }
    return {issues: [new ValidationIssue(result.message)]};
  },
);

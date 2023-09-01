import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {Runtype, Static} from 'runtypes';

import {isJSONSchema, isTypeBoxSchema} from '../utils';

export interface RuntypesResolver extends Resolver {
  base: Runtype;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
}

const coerce: Coerce<'runtypes'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'reflect' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema => async (data: unknown) => {
    const result = schema.validate(data);
    if (result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: result.value as any};
    }
    return {issues: [{message: result.message}]};
  },
);

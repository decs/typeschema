import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Runtype, Static} from 'runtypes';

import {isJSONSchema, isTypeBoxSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

interface RuntypesResolver extends Resolver {
  base: Runtype<this['type']>;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
  module: typeof import('runtypes');
}

declare global {
  export interface TypeSchemaRegistry {
    runtypes: RuntypesResolver;
  }
}

export const init: Adapter<'runtypes'>['init'] = async () =>
  maybe(() => import('runtypes'));

export const guard: Adapter<'runtypes'>['guard'] = schema =>
  'reflect' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'runtypes'>['createValidate'] =
  schema => async data => {
    const result = schema.validate(data);
    if (result.success) {
      return {data: result.value};
    }
    return {issues: [new ValidationIssue(result.message)]};
  };

import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Infer, Struct} from 'superstruct';

import {isJSONSchema, isTypeBoxSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

interface SuperstructResolver extends Resolver {
  base: Struct<this['type']>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends Struct<any, any>
    ? Infer<this['schema']>
    : never;
  module: typeof import('superstruct');
}

declare global {
  export interface TypeSchemaRegistry {
    superstruct: SuperstructResolver;
  }
}

export const init: Adapter<'superstruct'>['init'] = async () =>
  maybe(() => import('superstruct'));

export const guard: Adapter<'superstruct'>['guard'] = schema =>
  'refiner' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const validate: Adapter<'superstruct'>['validate'] =
  schema => async data => {
    const result = schema.validate(data, {coerce: true});
    if (result[0] == null) {
      return {data: result[1]};
    }
    const {message, path} = result[0];
    return {issues: [new ValidationIssue(message, path)]};
  };

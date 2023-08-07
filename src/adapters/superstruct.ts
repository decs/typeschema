import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Infer, Struct} from 'superstruct';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface SuperstructResolver extends Resolver {
  base: Struct<this['type']>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends Struct<any, any>
    ? Infer<this['schema']>
    : never;
}

export const coerce: Adapter<'superstruct'>['coerce'] = schema =>
  'refiner' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'superstruct'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    return async data => {
      const result = coercedSchema.validate(data, {coerce: true});
      if (result[0] == null) {
        return {data: result[1]};
      }
      const {message, path} = result[0];
      return {issues: [new ValidationIssue(message, path)]};
    };
  };

import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Type} from 'arktype';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface ArkTypeResolver extends Resolver {
  base: Type<this['type']>;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
}

export const coerce: Adapter<'arktype'>['coerce'] = schema =>
  'infer' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'arktype'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    return async data => {
      const result = coercedSchema(data);
      if (result.problems == null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {data: result.data as any};
      }
      return {
        issues: Array.from(result.problems).map(
          ({message, path}) => new ValidationIssue(message, path),
        ),
      };
    };
  };

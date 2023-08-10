import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {Type} from 'arktype';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface ArkTypeResolver extends Resolver {
  base: Type<this['type']>;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
}

const coerce: Coerce<'arktype'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'infer' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema => async (data: unknown) => {
    const result = schema(data);
    if (result.problems == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: result.data as any};
    }
    return {
      issues: Array.from(result.problems).map(
        ({message, path}) => new ValidationIssue(message, path),
      ),
    };
  },
);

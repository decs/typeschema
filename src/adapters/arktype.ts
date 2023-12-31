import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {Type} from 'arktype';

import {isJSONSchema, isTypeBoxSchema} from '../utils';

export interface ArkTypeResolver extends Resolver {
  base: Type;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
}

const coerce: Coerce<'arktype'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'infer' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema =>
    async (data: unknown): Promise<ValidationResult> => {
      const result = schema(data);
      if (result.problems == null) {
        return {
          data: result.data,
          success: true,
        };
      }
      return {
        issues: Array.from(result.problems).map(({message, path}) => ({
          message,
          path,
        })),
        success: false,
      };
    },
);

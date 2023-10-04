import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {Type} from 'npm:arktype@1.0.21-alpha';

import {isJSONSchema, isTypeBoxSchema} from '../utils.ts';

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

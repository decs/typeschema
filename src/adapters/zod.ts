import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {input, output, ZodSchema} from 'zod';

import {isJSONSchema, isTypeBoxSchema} from '../utils';

export interface ZodResolver extends Resolver {
  base: ZodSchema;
  input: this['schema'] extends ZodSchema ? input<this['schema']> : never;
  output: this['schema'] extends ZodSchema ? output<this['schema']> : never;
}

const coerce: Coerce<'zod'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  '_def' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema =>
    async (data: unknown): Promise<ValidationResult> => {
      const result = await schema.safeParseAsync(data);
      if (result.success) {
        return {
          data: result.data,
          success: true,
        };
      }
      return {
        issues: result.error.issues.map(({message, path}) => ({message, path})),
        success: false,
      };
    },
);

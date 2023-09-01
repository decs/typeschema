import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {input, output, ZodSchema} from 'https://deno.land/x/zod@v3.21.4/mod.ts';

import {isJSONSchema, isTypeBoxSchema} from '../utils.ts';

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

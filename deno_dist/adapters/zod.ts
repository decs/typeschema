import type {Resolver} from '../resolver.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {input, output, ZodSchema} from 'https://deno.land/x/zod@v3.21.4/mod.ts';

import {isJSONSchema, isTypeBoxSchema} from '../utils.ts';
import {ValidationIssue} from '../validation.ts';

export interface ZodResolver extends Resolver {
  base: ZodSchema<this['type']>;
  input: this['schema'] extends ZodSchema ? input<this['schema']> : never;
  output: this['schema'] extends ZodSchema ? output<this['schema']> : never;
}

const coerce: Coerce<'zod'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  '_def' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema => async (data: unknown) => {
    const result = await schema.safeParseAsync(data);
    if (result.success) {
      return {data: result.data};
    }
    return {
      issues: result.error.issues.map(
        ({message, path}) => new ValidationIssue(message, path),
      ),
    };
  },
);

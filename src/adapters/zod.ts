import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {input, output, ZodSchema} from 'zod';

import {isJSONSchema, isTypeBoxSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

interface ZodResolver extends Resolver {
  base: ZodSchema<this['type']>;
  input: this['schema'] extends ZodSchema ? input<this['schema']> : never;
  output: this['schema'] extends ZodSchema ? output<this['schema']> : never;
  module: typeof import('zod');
}

declare global {
  export interface TypeSchemaRegistry {
    zod: ZodResolver;
  }
}

export const init: Adapter<'zod'>['init'] = async () =>
  maybe(() => import('zod'));

export const guard: Adapter<'zod'>['guard'] = schema =>
  '_def' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const validate: Adapter<'zod'>['validate'] = schema => async data => {
  const result = await schema.safeParseAsync(data);
  if (result.success) {
    return {data: result.data};
  }
  return {
    issues: result.error.issues.map(
      ({message, path}) => new ValidationIssue(message, path),
    ),
  };
};

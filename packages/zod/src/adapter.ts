import type {Resolver, ValidationAdapter} from '@typeschema/core';
import type {input, output, ZodSchema} from 'zod';

export interface AdapterResolver extends Resolver {
  base: ZodSchema;
  input: this['schema'] extends ZodSchema ? input<this['schema']> : never;
  output: this['schema'] extends ZodSchema ? output<this['schema']> : never;
}

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  return async data => {
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
  };
};

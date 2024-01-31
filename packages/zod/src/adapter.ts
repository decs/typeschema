import type {Resolver, ValidationAdapter} from '@typeschema/core';
import type {input, output, ZodType} from 'zod';

export interface AdapterResolver extends Resolver {
  base: ZodType;
  input: this['schema'] extends this['base'] ? input<this['schema']> : never;
  output: this['schema'] extends this['base'] ? output<this['schema']> : never;
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

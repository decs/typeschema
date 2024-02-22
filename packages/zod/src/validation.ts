import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

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

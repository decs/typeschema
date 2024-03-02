import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  return async data => {
    const result = schema.try(data);
    if (result.ok) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: result.value as any,
        success: true,
      };
    }
    return {
      issues: result.issues.map(({code, path}) => ({message: code, path})),
      success: false,
    };
  };
};

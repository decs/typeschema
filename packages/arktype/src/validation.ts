import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  return async data => {
    const result = schema(data);
    if (result.problems == null) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: result.data as any,
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
  };
};

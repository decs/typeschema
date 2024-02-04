import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  return async data => {
    const result = schema.validate(data);
    if (result.success) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: result.value as any,
        success: true,
      };
    }
    return {
      issues: [{message: result.message}],
      success: false,
    };
  };
};

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  return async data => {
    try {
      return {
        data: await schema(data),
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          issues: [{message: error.message}],
          success: false,
        };
      }
      throw error;
    }
  };
};

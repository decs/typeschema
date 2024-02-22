import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  return async data => {
    const result = schema.validate(data);
    if (result.error == null) {
      return {
        data: result.value,
        success: true,
      };
    }
    return {
      issues: result.error.details.map(({message, path}) => ({
        message,
        path,
      })),
      success: false,
    };
  };
};

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  return async data => {
    const result = schema.validate(data, {coerce: true});
    if (result[0] == null) {
      return {
        data: result[1],
        success: true,
      };
    }
    const {message, path} = result[0];
    return {
      issues: [{message, path}],
      success: false,
    };
  };
};

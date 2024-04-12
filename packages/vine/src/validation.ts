import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {errors, Vine} = await import('@vinejs/vine');
  return {errors, vine: new Vine()};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {errors, vine} = await importValidationModule();
  const validator = vine.compile(schema);
  return async data => {
    try {
      return {
        data: await validator.validate(data),
        success: true,
      };
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return {
          issues: error.messages.map(
            ({message, field}: {message: string; field: string}) => ({
              message,
              path: field != null ? field.split('.') : undefined,
            }),
          ),
          success: false,
        };
      }
      throw error;
    }
  };
};

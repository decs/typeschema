import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {ValidationError} = await import('yup');
  return {ValidationError};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {ValidationError} = await importValidationModule();
  return async data => {
    try {
      return {
        data: await schema.validate(data, {strict: true}),
        success: true,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        const {message, path} = error;
        return {
          issues: [
            {
              message,
              path: path != null && path !== '' ? [path] : undefined,
            },
          ],
          success: false,
        };
      }
      throw error;
    }
  };
};

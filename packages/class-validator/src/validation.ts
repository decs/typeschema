import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {validate} = await import('class-validator');
  return {validate};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {validate} = await importValidationModule();
  return async data => {
    const errors = await validate(Object.assign(new schema(), data));
    if (errors.length === 0) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: errors.map(error => ({
        message: error.toString(),
        path: [error.property],
      })),
      success: false,
    };
  };
};

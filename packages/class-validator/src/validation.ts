import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  try {
    const moduleName = 'class-validator';
    const {validate} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('class-validator');
    return {validate};
  } catch (error) {
    throw error;
  }
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

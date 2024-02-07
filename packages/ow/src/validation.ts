import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  try {
    const {default: ow, ArgumentError} = await import(
      /* webpackIgnore: true */ 'ow'
    );
    return {ArgumentError, ow};
  } catch (error) {
    throw error;
  }
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {ArgumentError, ow} = await importValidationModule();
  const assertSchema = ow.create(schema);
  return async data => {
    try {
      assertSchema(data, 'data');
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    } catch (error) {
      if (error instanceof ArgumentError) {
        return {
          issues: Array.from(error.validationErrors.values()).flatMap(
            messages => Array.from(messages).map(message => ({message})),
          ),
          success: false,
        };
      }
      throw error;
    }
  };
};

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {safeParseAsync} = await import('valibot');
  return {safeParseAsync};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {safeParseAsync} = await importValidationModule();
  return async data => {
    const result = await safeParseAsync(schema, data);
    if (result.success) {
      return {
        data: result.output,
        success: true,
      };
    }
    return {
      issues: result.issues.map(({message, path}) => ({
        message,
        path: path?.map(({type, key}) =>
          type === 'map' || type === 'unknown' ? String(key) : key,
        ),
      })),
      success: false,
    };
  };
};

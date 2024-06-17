import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {getDotPath, safeParseAsync} = await import('valibot');
  return {getDotPath, safeParseAsync};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {getDotPath, safeParseAsync} = await importValidationModule();
  return async data => {
    const result = await safeParseAsync(schema, data);
    if (result.success) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: result.output as any,
        success: true,
      };
    }
    return {
      issues: result.issues.map(issue => ({
        message: issue.message,
        path: getDotPath(issue)?.split('.'),
      })),
      success: false,
    };
  };
};

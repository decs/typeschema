import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';
import { getDotPath } from 'valibot';

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
      issues: result.issues.map((issue) => {
        const path = getDotPath(issue);

        return {
          message: issue.message,
          path: path?.split('.'),
        };
      }),
      success: false,
    };
  };
};

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {ArkErrors} = await import('arktype');
  return {ArkErrors};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {ArkErrors} = await importValidationModule();
  return async data => {
    const result = schema(data);
    if (result instanceof ArkErrors) {
      return {
        issues: Array.from(result).map(({message, path}) => ({message, path})),
        success: false,
      };
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: result as any,
      success: true,
    };
  };
};

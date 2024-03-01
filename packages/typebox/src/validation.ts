import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {TypeCompiler} = await import('@sinclair/typebox/compiler');
  return {TypeCompiler};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {TypeCompiler} = await importValidationModule();
  const result = TypeCompiler.Compile(schema);
  return async data => {
    if (result.Check(data)) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: [...result.Errors(data)].map(({message, path}) => ({
        message,
        path: [path],
      })),
      success: false,
    };
  };
};

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {isRight} = await import('fp-ts/Either');
  return {isRight};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {isRight} = await importValidationModule();
  return async data => {
    const result = schema.decode(data);
    if (isRight(result)) {
      return {
        data: result.right,
        success: true,
      };
    }
    return {
      issues: result.left.map(({message, context}) => ({
        message: message ?? '',
        path: context.map(({key}) => key),
      })),
      success: false,
    };
  };
};

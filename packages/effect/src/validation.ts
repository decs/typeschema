import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {isRight} = await import('effect/Either');
  const {parseEither} = await import('@effect/schema/Schema');
  const {formatError} = await import('@effect/schema/TreeFormatter');
  return {formatError, isRight, parseEither};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {formatError, isRight, parseEither} = await importValidationModule();
  const parseSchema = parseEither(schema);
  return async data => {
    const result = parseSchema(data);
    if (isRight(result)) {
      return {
        data: result.right,
        success: true,
      };
    }
    return {
      issues: [{message: formatError(result.left)}],
      success: false,
    };
  };
};

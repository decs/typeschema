import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {
    Effect: {runSync},
    Either: {isRight},
  } = await import('effect');
  const {
    Schema: {decodeUnknownEither},
    TreeFormatter: {formatError},
  } = await import('@effect/schema');
  return {decodeUnknownEither, formatError, isRight, runSync};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {decodeUnknownEither, formatError, isRight, runSync} =
    await importValidationModule();
  const parseSchema = decodeUnknownEither(schema);
  return async data => {
    const result = parseSchema(data);
    if (isRight(result)) {
      return {
        data: result.right,
        success: true,
      };
    }
    return {
      issues: [{message: runSync(formatError(result.left))}],
      success: false,
    };
  };
};

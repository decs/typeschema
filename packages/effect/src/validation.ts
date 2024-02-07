import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  try {
    const {isRight} = await import(/* webpackIgnore: true */ 'effect/Either');
    const {parseEither} = await import(
      /* webpackIgnore: true */ '@effect/schema/Schema'
    );
    const {formatError} = await import(
      /* webpackIgnore: true */ '@effect/schema/TreeFormatter'
    );
    return {formatError, isRight, parseEither};
  } catch (error) {
    throw error;
  }
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {parseEither, isRight, formatError} = await importValidationModule();
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

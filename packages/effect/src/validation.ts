import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationEitherModule = memoize(async () => {
  const {isRight} = await import('effect/Either');
  return {isRight};
});
const importValidationSchemaModule = memoize(async () => {
  const {parseEither} = await import('@effect/schema/Schema');
  return {parseEither};
});
const importValidationTreeFormatterModule = memoize(async () => {
  const {formatError} = await import('@effect/schema/TreeFormatter');
  return {formatError};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {isRight} = await importValidationEitherModule();
  const {parseEither} = await importValidationSchemaModule();
  const {formatError} = await importValidationTreeFormatterModule();
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

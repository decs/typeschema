import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {compile} = await import('suretype');
  return {compile};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {compile} = await importValidationModule();
  const parseSchema = compile(schema);
  return async data => {
    const result = parseSchema(data);
    if (result.ok) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: (result.errors ?? []).map(({message, schemaPath}) => ({
        message: message ?? '',
        path: [schemaPath],
      })),
      success: false,
    };
  };
};

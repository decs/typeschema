import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  try {
    const moduleName = 'ajv';
    const {default: Ajv} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('ajv');
    return new Ajv();
  } catch (error) {
    throw error;
  }
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const ajv = await importValidationModule();
  const validateSchema = ajv.compile(schema);
  return async data => {
    if (validateSchema(data)) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: (validateSchema.errors ?? []).map(({message, schemaPath}) => ({
        message: message ?? '',
        path: [schemaPath],
      })),
      success: false,
    };
  };
};

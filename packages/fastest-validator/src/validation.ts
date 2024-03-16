import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importValidationModule = memoize(async () => {
  const {default: FastestValidator} = await import('fastest-validator');
  return new FastestValidator();
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const fastestValidator = await importValidationModule();
  const validateSchema = fastestValidator.compile(schema);
  return async data => {
    const result = await validateSchema(data);
    if (result === true) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: result.map(({message, field}) => ({
        message: message ?? '',
        path: [field],
      })),
      success: false,
    };
  };
};

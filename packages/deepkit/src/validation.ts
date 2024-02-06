import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

const importValidationModule = async () => {
  try {
    const {validate} = await import(/* webpackIgnore: true */ '@deepkit/type');
    return {validate};
  } catch (error) {
    throw error;
  }
};

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {validate} = await importValidationModule();
  return async data => {
    const result = validate(data, schema);
    if (result.length === 0) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: result.map(({message, path}) => ({message, path: [path]})),
      success: false,
    };
  };
};

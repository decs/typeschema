import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

const importValidationModule = async () => {
  try {
    const {TypeCompiler} = await import(
      /* webpackIgnore: true */ '@sinclair/typebox/compiler'
    );
    return {TypeCompiler};
  } catch (error) {
    throw error;
  }
};

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
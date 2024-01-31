import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

const importValibotValidationAdapter = async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/valibot'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
};

const importZodValidationAdapter = async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/zod'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
};

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  if ('_def' in schema) {
    const zodValidationAdapter = await importZodValidationAdapter();
    return zodValidationAdapter(schema);
  }
  if ('async' in schema) {
    const valibotValidationAdapter = await importValibotValidationAdapter();
    return valibotValidationAdapter(schema);
  }
  schema satisfies never;
  throw Error('not supported');
};

import type {
  Input,
  Output,
  Resolver,
  Schema,
  ValidationAdapter,
} from '@typeschema/core';
import type {AdapterResolver as ValibotResolver} from '@typeschema/valibot';
import type {AdapterResolver as ZodResolver} from '@typeschema/zod';

type AnyResolver = ValibotResolver | ZodResolver;

export interface AdapterResolver extends Resolver {
  base: Schema<AnyResolver>;
  input: this['schema'] extends this['base']
    ? Input<AnyResolver, this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? Output<AnyResolver, this['schema']>
    : never;
}

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

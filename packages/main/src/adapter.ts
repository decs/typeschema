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
  input: this['schema'] extends Schema<AnyResolver>
    ? Input<AnyResolver, this['schema']>
    : never;
  output: this['schema'] extends Schema<AnyResolver>
    ? Output<AnyResolver, this['schema']>
    : never;
}

const fetchValibotAdapter = async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/valibot'
    );
    return {validationAdapter};
  } catch (error) {
    throw error;
  }
};

const fetchZodAdapter = async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/zod'
    );
    return {validationAdapter};
  } catch (error) {
    throw error;
  }
};

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  if ('_def' in schema) {
    const {validationAdapter: zodValidationAdapter} = await fetchZodAdapter();
    return zodValidationAdapter(schema);
  } else if ('async' in schema) {
    const {validationAdapter: valibotValidationAdapter} =
      await fetchValibotAdapter();
    return valibotValidationAdapter(schema);
  } else {
    throw Error('not supported');
  }
};

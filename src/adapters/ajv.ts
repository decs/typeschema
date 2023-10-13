import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {SchemaObject} from 'ajv';

import {isJSONSchema, memoize} from '../utils';

export interface AjvResolver extends Resolver {
  base: SchemaObject;
}

export const fetchModule = /* @__PURE__ */ memoize(async () => {
  const {default: Ajv} = await import(/* webpackIgnore: true */ 'ajv');
  return new Ajv();
});

const coerce: Coerce<'ajv'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  isJSONSchema(schema) ? fn(schema) : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const ajv = await fetchModule();
  const validateSchema = ajv.compile(schema);
  return async (data: unknown): Promise<ValidationResult> => {
    if (validateSchema(data)) {
      return {
        data,
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
});

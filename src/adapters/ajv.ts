import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {SchemaObject} from 'ajv';

import {isJSONSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface AjvResolver extends Resolver {
  base: SchemaObject;
}

const fetchModule = memoize(async () => {
  const {default: Ajv} = await import('ajv');
  return {ajv: new Ajv()};
});

const coerce: Coerce<'ajv'> = fn => async schema =>
  isJSONSchema(schema) ? fn(schema) : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {ajv} = await fetchModule();
  const validateSchema = ajv.compile(schema);
  return async data => {
    if (validateSchema(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    }
    return {
      issues: (validateSchema.errors ?? []).map(
        ({message, schemaPath}) =>
          new ValidationIssue(message ?? '', [schemaPath]),
      ),
    };
  };
});

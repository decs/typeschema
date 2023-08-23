import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {SchemaObject} from 'ajv';

import {isJSONSchema, memoize} from '../utils';

export interface AjvResolver extends Resolver {
  base: SchemaObject;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/ajv'),
);

const coerce: Coerce<'ajv'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  isJSONSchema(schema) ? fn(schema) : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {ajv} = await fetchModule();
  const validateSchema = ajv.compile(schema);
  return async (data: unknown) => {
    if (validateSchema(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    }
    return {
      issues: (validateSchema.errors ?? []).map(({message, schemaPath}) => ({
        message: message ?? '',
        path: [schemaPath],
      })),
    };
  };
});

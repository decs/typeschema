import type {Resolver} from '../resolver.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {SchemaObject} from 'npm:ajv@8.12.0';

import {isJSONSchema, memoize} from '../utils.ts';

export interface AjvResolver extends Resolver {
  base: SchemaObject;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/ajv.ts'),
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

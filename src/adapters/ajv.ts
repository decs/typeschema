import type {Resolver} from '../resolver';
import type {Adapter} from '.';
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

export const coerce: Adapter<'ajv'>['coerce'] = schema =>
  isJSONSchema(schema) ? schema : null;

export const createValidate: Adapter<'ajv'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    const {ajv} = await fetchModule();
    const validateSchema = ajv.compile(coercedSchema);
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
  };

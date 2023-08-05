import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {SchemaObject} from 'ajv';
import type Ajv from 'ajv';

import {isJSONSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

interface AjvResolver extends Resolver {
  base: SchemaObject;
  module: Ajv;
}

declare global {
  export interface TypeSchemaRegistry {
    ajv: AjvResolver;
  }
}

export const init: Adapter<AjvResolver>['init'] = async () => {
  const Ajv = await maybe(() => import('ajv'));
  if (Ajv == null) {
    return undefined;
  }
  return new Ajv.default();
};

export const guard: Adapter<AjvResolver>['guard'] = schema =>
  isJSONSchema(schema) ? schema : undefined;

export const validate: Adapter<AjvResolver>['validate'] = (schema, ajv) => {
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
};

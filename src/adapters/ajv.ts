import type {TypeSchema} from '../api/schema';
import type {Resolver} from '../resolver';
import type Ajv from 'ajv';
import type {SchemaObject} from 'ajv';

import {ValidationIssue} from '../api/schema';
import {register} from '../registry';
import {isJSONSchema} from '../utils';

interface AjvResolver extends Resolver {
  base: SchemaObject;
  module: typeof import('ajv');
}

declare global {
  export interface TypeSchemaRegistry {
    ajv: AjvResolver;
  }
}

let ajv: Ajv | null = null;

register<'ajv'>(
  schema => (isJSONSchema(schema) ? schema : null),
  async <T>(
    schema: SchemaObject,
    {default: Ajv}: typeof import('ajv'),
  ): Promise<TypeSchema<T>> => {
    if (ajv == null) {
      ajv = new Ajv();
    }
    const validate = ajv.compile(schema);
    return {
      validate: async data => {
        if (validate(data)) {
          return {data: data as T};
        }
        return {
          issues: (validate.errors ?? []).map(
            ({message, schemaPath}) =>
              new ValidationIssue(message ?? '', [schemaPath]),
          ),
        };
      },
    };
  },
  'ajv',
);

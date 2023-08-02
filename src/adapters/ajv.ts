import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type Ajv from 'ajv';
import type {SchemaObject} from 'ajv';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema} from '../utils';

interface AjvResolver extends Resolver {
  base: SchemaObject;
}

declare global {
  export interface TypeSchemaRegistry {
    ajv: AjvResolver;
  }
}

let ajv: Ajv | null = null;

register<'ajv'>(
  schema => (isJSONSchema(schema) ? schema : null),
  async <T>(schema: SchemaObject): Promise<TypeSchema<T>> => {
    if (ajv == null) {
      const Ajv = await import('ajv');
      ajv = new Ajv.default();
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

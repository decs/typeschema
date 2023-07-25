import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type {FromJSONSchema, JSONSchema} from '../utils';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema} from '../utils';

interface AjvResolver extends Resolver {
  base: JSONSchema;
  input: this['schema'] extends JSONSchema
    ? FromJSONSchema<this['schema']>
    : never;
  output: this['schema'] extends JSONSchema
    ? FromJSONSchema<this['schema']>
    : never;
}

declare global {
  export interface TypeSchemaRegistry {
    ajv: AjvResolver;
  }
}

register<'ajv'>(
  schema => {
    if (!isJSONSchema(schema)) {
      return null;
    }
    return schema;
  },
  async <T>(schema: JSONSchema): Promise<TypeSchema<T>> => {
    const Ajv = await import('ajv');
    const ajv = new Ajv.default();
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
  () => import('ajv'),
);

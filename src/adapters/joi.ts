import type {Resolver} from '../resolver';
import type {AnySchema} from 'joi';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface JoiResolver extends Resolver {
  base: AnySchema<this['type']>;
  input: this['schema'] extends AnySchema<infer T> ? T : never;
  output: this['schema'] extends AnySchema<infer T> ? T : never;
}

declare global {
  export interface TypeSchemaRegistry {
    joi: JoiResolver;
  }
}

register<'joi'>(
  async schema => {
    if (
      !('_flags' in schema) ||
      isTypeBoxSchema(schema) ||
      isJSONSchema(schema)
    ) {
      return null;
    }
    return schema;
  },
  async schema => ({
    validate: async data => {
      const result = schema.validate(data);
      if (result.error == null) {
        return {data: result.value};
      }
      return {
        issues: result.error.details.map(
          ({message, path}) => new ValidationIssue(message, path),
        ),
      };
    },
  }),
  () => import('joi'),
);

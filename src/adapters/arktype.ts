import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type {Type} from 'arktype';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface ArkTypeResolver extends Resolver {
  base: Type<this['type']>;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
  module: typeof import('arktype');
}

declare global {
  export interface TypeSchemaRegistry {
    arktype: ArkTypeResolver;
  }
}

register<'arktype'>(
  schema =>
    'infer' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
      ? schema
      : null,
  async <T>(schema: Type<T>): Promise<TypeSchema<T>> => ({
    validate: async data => {
      const result = schema(data);
      if (result.problems == null) {
        return {data: result.data as T};
      }
      return {
        issues: Array.from(result.problems).map(
          ({message, path}) => new ValidationIssue(message, path),
        ),
      };
    },
  }),
  'arktype',
);

import type {TypeSchema} from '../api/schema';
import type {Resolver} from '../resolver';
import type {Type} from '@deepkit/type';

import {ValidationIssue} from '../api/schema';
import {register} from '../registry';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface DeepkitResolver extends Resolver {
  base: Type;
  module: typeof import('@deepkit/type');
}

declare global {
  export interface TypeSchemaRegistry {
    deepkit: DeepkitResolver;
  }
}

register<'deepkit'>(
  schema =>
    'kind' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
      ? schema
      : null,
  async <T>(
    schema: Type,
    {validate}: typeof import('@deepkit/type'),
  ): Promise<TypeSchema<T>> => ({
    validate: async data => {
      const result = validate(data, schema);
      if (result.length === 0) {
        return {data: data as T};
      }
      return {
        issues: result.map(
          ({message, path}) => new ValidationIssue(message, [path]),
        ),
      };
    },
  }),
  '@deepkit/type',
);

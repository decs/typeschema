import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type {Type} from '@deepkit/type';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface DeepkitResolver extends Resolver {
  base: Type;
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
  async <T>(schema: Type): Promise<TypeSchema<T>> => {
    const {validate} = await import('@deepkit/type');
    return {
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
    };
  },
  '@deepkit/type',
);

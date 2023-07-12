import type {TypeSchemaResolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type {Problems, Type} from 'arktype';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {maybe} from '../utils';

interface ArkTypeResolver extends TypeSchemaResolver {
  base: Type<this['type']>;
  input: this['schema'] extends Type ? this['schema']['inferIn'] : never;
  output: this['schema'] extends Type ? this['schema']['infer'] : never;
  error: Problems;
}

declare global {
  export interface TypeSchemaRegistry {
    arktype: ArkTypeResolver;
  }
}

register<'arktype'>(
  async schema => {
    const ArkType = await maybe(() => import('arktype'));
    if (ArkType == null) {
      return null;
    }
    if (!('infer' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  <T>(schema: Type<T>): TypeSchema<T> => ({
    validate: async data => {
      const result = schema(data);
      if (result.problems == null) {
        return {data: result.data as T};
      }
      return {
        issues: [...result.problems].map(
          ({message, path}) => new ValidationIssue(message, path),
        ),
      };
    },
  }),
);

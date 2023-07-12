import type {TypeSchemaResolver} from '../resolver';
import type {Problems, Type} from 'arktype';

import {register} from '../registry';
import {ValidationError} from '../schema';
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
  <T>(schema: Type<T>) => ({
    validate: async data => {
      const result = schema(data);
      if (result.problems == null) {
        return {valid: true, value: result.data};
      }
      return {
        errors: [...result.problems].map(
          ({message, path}) => new ValidationError(message, path),
        ),
        valid: false,
      };
    },
  }),
);

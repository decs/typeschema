import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type {ReceiveType, Type} from '@deepkit/type';

import {validate} from '@deepkit/type';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isTypeBoxSchema} from '../utils';

interface DeepkitResolver extends Resolver {
  base: Type;
  input: this['schema'] extends ReceiveType<infer T> ? T : never;
  output: this['schema'] extends ReceiveType<infer T> ? T : never;
}

declare global {
  export interface TypeSchemaRegistry {
    deepkit: DeepkitResolver;
  }
}

register<'deepkit'>(
  schema => ('kind' in schema && !isTypeBoxSchema(schema) ? schema : null),
  async <T>(schema: Type): Promise<TypeSchema<T>> => ({
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

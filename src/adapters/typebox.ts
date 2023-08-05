import type {TypeSchema} from '../api/schema';
import type {Resolver} from '../resolver';
import type {Static, TSchema} from '@sinclair/typebox';

import {ValidationIssue} from '../api/schema';
import {register} from '../registry';
import {isTypeBoxSchema} from '../utils';

interface TypeBoxResolver extends Resolver {
  base: TSchema;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
  module: typeof import('@sinclair/typebox/compiler');
}

declare global {
  export interface TypeSchemaRegistry {
    typebox: TypeBoxResolver;
  }
}

register<'typebox'>(
  schema => (isTypeBoxSchema(schema) ? schema : null),
  async <T>(
    schema: TSchema,
    {TypeCompiler}: typeof import('@sinclair/typebox/compiler'),
  ): Promise<TypeSchema<T>> => {
    const result = TypeCompiler.Compile(schema);
    return {
      validate: async data => {
        if (result.Check(data)) {
          return {data: data as T};
        }
        return {
          issues: [...result.Errors(data)].map(
            ({message, path}) => new ValidationIssue(message, [path]),
          ),
        };
      },
    };
  },
  '@sinclair/typebox/compiler',
);

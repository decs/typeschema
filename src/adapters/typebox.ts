import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type {Static, TSchema} from '@sinclair/typebox';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isTypeBoxSchema} from '../utils';

interface TypeBoxResolver extends Resolver {
  base: TSchema;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
}

declare global {
  export interface TypeSchemaRegistry {
    typebox: TypeBoxResolver;
  }
}

register<'typebox'>(
  schema => (isTypeBoxSchema(schema) ? schema : null),
  async <T>(schema: TSchema): Promise<TypeSchema<T>> => {
    const {TypeCompiler} = await import('@sinclair/typebox/compiler');
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
  '@sinclair/typebox',
);

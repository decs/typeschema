import type {TypeSchemaResolver} from '../resolver';
import type {Static, TSchema} from '@sinclair/typebox';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {maybe} from '../utils';

type TypeBoxSchema<T> = TSchema & {static: T};

interface TypeBoxResolver extends TypeSchemaResolver {
  base: TypeBoxSchema<this['type']>;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
}

declare global {
  export interface TypeSchemaRegistry {
    typebox: TypeBoxResolver;
  }
}

register<'typebox'>(
  async schema => {
    const TypeBox = await maybe(() => import('@sinclair/typebox'));
    if (TypeBox == null) {
      return null;
    }
    if (!(TypeBox.Kind in schema)) {
      return null;
    }
    return schema;
  },
  async schema => {
    const {TypeCompiler} = await import('@sinclair/typebox/compiler');
    const result = TypeCompiler.Compile(schema);
    return {
      validate: async data => {
        if (result.Check(data)) {
          return {data};
        }
        return {
          issues: [...result.Errors(data)].map(
            ({message, path}) => new ValidationIssue(message, [path]),
          ),
        };
      },
    };
  },
);

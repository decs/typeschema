import type {Schema} from '../registry';
import type {InferSchema, TypeSchemaResolver} from '../resolver';
import type {Static, TSchema} from '@sinclair/typebox';
import type {TypeCheck} from '@sinclair/typebox/compiler';

import {register} from '../registry';
import {maybe} from '../utils';

type TypeBoxSchema<T> = TSchema & {static: T};

interface TypeBoxResolver extends TypeSchemaResolver {
  base: TypeBoxSchema<this['type']>;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
  error: ReturnType<TypeCheck<TSchema>['Errors']>;
}

declare global {
  export interface TypeSchemaRegistry {
    typebox: TypeBoxResolver;
  }
}

register(async <T>(schema: Schema<T>) => {
  const TypeBox = await maybe(() => import('@sinclair/typebox'));
  if (TypeBox == null) {
    return null;
  }
  if (!(TypeBox.Kind in schema)) {
    return null;
  }
  schema satisfies InferSchema<TypeBoxResolver, T>;
  return {
    assert: async data => {
      const {TypeCompiler} = await import('@sinclair/typebox/compiler');
      const result = TypeCompiler.Compile(schema);
      if (result.Check(data)) {
        return data;
      }
      throw new Error(JSON.stringify([...result.Errors(data)]));
    },
  };
});

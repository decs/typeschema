import type {Schema, WrappedSchema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
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

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
  const Typebox = await maybe(() => import('@sinclair/typebox'));
  if (Typebox == null) {
    return null;
  }
  if (!(Typebox.Kind in schema)) {
    return null;
  }
  schema satisfies TypeBoxSchema<T>;
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
}

declare global {
  export interface TypeSchemaRegistry {
    typebox: TypeBoxResolver;
  }
}
register(wrap);

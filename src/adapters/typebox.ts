import type {TypeSchemaResolver} from '../resolver';
import type {Static, TSchema} from '@sinclair/typebox';
import type {TypeCheck} from '@sinclair/typebox/compiler';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {maybe} from '../utils';

interface TypeBoxResolver extends TypeSchemaResolver {
  base: TSchema;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
  error: ReturnType<TypeCheck<TSchema>['Errors']>;
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
  schema => ({
    validate: async data => {
      const {TypeCompiler} = await import('@sinclair/typebox/compiler');
      const result = TypeCompiler.Compile(schema);
      if (result.Check(data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed because schema can't be resolved to a specific type
        return {data: data as any};
      }
      return {
        issues: [...result.Errors(data)].map(
          ({message, path}) => new ValidationIssue(message, [path]),
        ),
      };
    },
  }),
);

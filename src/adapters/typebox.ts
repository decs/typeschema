import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Static, TSchema} from '@sinclair/typebox';

import {isTypeBoxSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

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

export const init: Adapter<'typebox'>['init'] = async () =>
  maybe(() => import('@sinclair/typebox/compiler'));

export const guard: Adapter<'typebox'>['guard'] = schema =>
  isTypeBoxSchema(schema) ? schema : null;

export const validate: Adapter<'typebox'>['validate'] = (
  schema,
  {TypeCompiler},
) => {
  const result = TypeCompiler.Compile(schema);
  return async data => {
    if (result.Check(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    }
    return {
      issues: [...result.Errors(data)].map(
        ({message, path}) => new ValidationIssue(message, [path]),
      ),
    };
  };
};

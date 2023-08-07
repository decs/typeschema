import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Static, TSchema} from '@sinclair/typebox';

import {isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface TypeBoxResolver extends Resolver {
  base: TSchema;
  input: this['schema'] extends TSchema ? Static<this['schema']> : never;
  output: this['schema'] extends TSchema ? Static<this['schema']> : never;
}

const fetchModule = memoize(async () => {
  const {TypeCompiler} = await import('@sinclair/typebox/compiler');
  return {TypeCompiler};
});

export const coerce: Adapter<'typebox'>['coerce'] = schema =>
  isTypeBoxSchema(schema) ? schema : null;

export const createValidate: Adapter<'typebox'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    const {TypeCompiler} = await fetchModule();
    const result = TypeCompiler.Compile(coercedSchema);
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

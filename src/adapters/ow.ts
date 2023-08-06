import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {ArgumentError, Infer, Ow, Predicate} from 'ow';

import {isJSONSchema, isTypeBoxSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

interface OwResolver extends Resolver {
  base: Predicate<this['type']>;
  input: this['schema'] extends Predicate ? Infer<this['schema']> : never;
  output: this['schema'] extends Predicate ? Infer<this['schema']> : never;
  module: {
    ow: Ow;
    ArgumentError: typeof ArgumentError;
  };
}

declare global {
  export interface TypeSchemaRegistry {
    ow: OwResolver;
  }
}

export const init: Adapter<'ow'>['init'] = async () => {
  const Ow = await maybe(() => import('ow'));
  if (Ow == null) {
    return null;
  }
  const {ArgumentError, default: ow} = Ow;
  return {ArgumentError, ow};
};

export const guard: Adapter<'ow'>['guard'] = schema =>
  'context' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'ow'>['createValidate'] = (
  schema,
  {ow, ArgumentError},
) => {
  const assertSchema = ow.create(schema);
  return async data => {
    try {
      assertSchema(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    } catch (error) {
      if (error instanceof ArgumentError) {
        return {
          issues: Array.from(error.validationErrors.values()).flatMap(
            messages =>
              Array.from(messages).map(message => new ValidationIssue(message)),
          ),
        };
      }
      throw error;
    }
  };
};

import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Any, OutputOf, Type, TypeOf} from 'io-ts';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface IoTsResolver extends Resolver {
  base: Type<this['type']>;
  input: this['schema'] extends Any ? OutputOf<this['schema']> : never;
  output: this['schema'] extends Any ? TypeOf<this['schema']> : never;
}

const fetchModule = memoize(async () => {
  const {isRight} = await import('fp-ts/Either');
  return {isRight};
});

export const coerce: Adapter<'io-ts'>['coerce'] = schema =>
  'encode' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'io-ts'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    const {isRight} = await fetchModule();
    return async data => {
      const result = coercedSchema.decode(data);
      if (isRight(result)) {
        return {data: result.right};
      }
      return {
        issues: result.left.map(
          ({message, context}) =>
            new ValidationIssue(
              message ?? '',
              context.map(({key}) => key),
            ),
        ),
      };
    };
  };

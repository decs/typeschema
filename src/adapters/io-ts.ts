import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {Any, OutputOf, Type, TypeOf} from 'io-ts';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface IoTsResolver extends Resolver {
  base: Type<this['type']>;
  input: this['schema'] extends Any ? OutputOf<this['schema']> : never;
  output: this['schema'] extends Any ? TypeOf<this['schema']> : never;
}

export const fetchModule = memoize(async () => {
  const {isRight} = await import('fp-ts/Either');
  return {isRight};
});

const coerce: Coerce<'io-ts'> = fn => schema =>
  'encode' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {isRight} = await fetchModule();
  return async (data: unknown) => {
    const result = schema.decode(data);
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
});

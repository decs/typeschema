import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Any, OutputOf, Type, TypeOf} from 'io-ts';

import {isJSONSchema, isTypeBoxSchema, maybeImport} from '../utils';
import {ValidationIssue} from '../validation';

interface IoTsResolver extends Resolver {
  base: Type<this['type']>;
  input: this['schema'] extends Any ? OutputOf<this['schema']> : never;
  output: this['schema'] extends Any ? TypeOf<this['schema']> : never;
  module: typeof import('fp-ts/Either');
}

declare global {
  export interface TypeSchemaRegistry {
    'io-ts': IoTsResolver;
  }
}

export const init: Adapter<'io-ts'>['init'] = async () =>
  maybeImport<typeof import('fp-ts/Either')>('fp-ts/Either');

export const coerce: Adapter<'io-ts'>['coerce'] = schema =>
  'encode' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'io-ts'>['createValidate'] =
  (schema, {isRight}) =>
  async data => {
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

import type {Resolver} from '../resolver';
import type {Any, OutputOf, Type, TypeOf} from 'io-ts';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

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

register<'io-ts'>(
  schema =>
    'encode' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
      ? schema
      : null,
  async (schema, {isRight}) => {
    return {
      validate: async data => {
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
      },
    };
  },
  'fp-ts/Either',
);

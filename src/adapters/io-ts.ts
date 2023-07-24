import type {Resolver} from '../resolver';
import type {Any, OutputOf, Type, TypeOf} from 'io-ts';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, maybe} from '../utils';

interface IoTsResolver extends Resolver {
  base: Type<this['type']>;
  input: this['schema'] extends Any ? OutputOf<this['schema']> : never;
  output: this['schema'] extends Any ? TypeOf<this['schema']> : never;
}

declare global {
  export interface TypeSchemaRegistry {
    'io-ts': IoTsResolver;
  }
}

register<'io-ts'>(
  async schema => {
    const IoTs = await maybe(() => import('io-ts'));
    if (IoTs == null) {
      return null;
    }
    if (!('encode' in schema) || 'static' in schema || isJSONSchema(schema)) {
      return null;
    }
    return schema;
  },
  async schema => ({
    validate: async data => {
      const {isRight} = await import('fp-ts/Either');
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
  }),
);

import type {TypeSchemaResolver} from '../resolver';
import type {Any, Errors, OutputOf, Type, TypeOf} from 'io-ts';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {maybe} from '../utils';

interface IoTsResolver extends TypeSchemaResolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed for assignability
  base: Type<any>;
  input: this['schema'] extends Any ? OutputOf<this['schema']> : never; // iots output is output of encoder, so input of decoder
  output: this['schema'] extends Any ? TypeOf<this['schema']> : never;
  error: Errors;
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
    if (!('encode' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  schema => ({
    validate: async data => {
      const {isRight} = await import('fp-ts/Either');
      const result = schema.decode(data);
      if (isRight(result)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed because schema can't be resolved to a specific type
        return {data: result.right as any};
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

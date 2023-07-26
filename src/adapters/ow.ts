import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';
import type {Infer, Predicate} from 'ow';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isTypeBoxSchema} from '../utils';

interface OwResolver extends Resolver {
  base: Predicate<this['type']>;
  input: this['schema'] extends Predicate ? Infer<this['schema']> : never;
  output: this['schema'] extends Predicate ? Infer<this['schema']> : never;
}

declare global {
  export interface TypeSchemaRegistry {
    ow: OwResolver;
  }
}

register<'ow'>(
  schema => ('context' in schema && !isTypeBoxSchema(schema) ? schema : null),
  async <T>(schema: Predicate<T>): Promise<TypeSchema<T>> => {
    const ow = await import('ow');
    const {ArgumentError} = ow;
    const assert = ow.default.create(schema);
    return {
      validate: async data => {
        try {
          assert(data);
          return {data: data as T};
        } catch (error) {
          if (error instanceof ArgumentError) {
            return {
              issues: Array.from(error.validationErrors.values()).flatMap(
                messages =>
                  Array.from(messages).map(
                    message => new ValidationIssue(message),
                  ),
              ),
            };
          }
          throw error;
        }
      },
    };
  },
  'ow',
);

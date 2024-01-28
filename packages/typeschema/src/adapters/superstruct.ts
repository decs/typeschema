import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {Infer, Struct} from 'superstruct';

import {isJSONSchema, isTypeBoxSchema} from '../utils';

export interface SuperstructResolver extends Resolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  base: Struct<any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: this['schema'] extends Struct<any, any>
    ? Infer<this['schema']>
    : never;
}

const coerce: Coerce<'superstruct'> =
  /* @__NO_SIDE_EFFECTS__ */
  fn => schema =>
    'refiner' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
      ? fn(schema)
      : undefined;

export const createValidate: CreateValidate = coerce(
  async schema =>
    async (data: unknown): Promise<ValidationResult> => {
      const result = schema.validate(data, {coerce: true});
      if (result[0] == null) {
        return {
          data: result[1],
          success: true,
        };
      }
      const {message, path} = result[0];
      return {
        issues: [{message, path}],
        success: false,
      };
    },
);

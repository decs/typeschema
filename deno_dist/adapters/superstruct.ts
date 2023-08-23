import type {Resolver} from '../resolver.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {Infer, Struct} from 'npm:superstruct@1.0.3';

import {isJSONSchema, isTypeBoxSchema} from '../utils.ts';

export interface SuperstructResolver extends Resolver {
  base: Struct<this['type']>;
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
  async schema => async (data: unknown) => {
    const result = schema.validate(data, {coerce: true});
    if (result[0] == null) {
      return {data: result[1]};
    }
    const {message, path} = result[0];
    return {issues: [{message, path}]};
  },
);

import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {AnySchema} from 'joi';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface JoiResolver extends Resolver {
  base: AnySchema<this['type']>;
}

const coerce: Coerce<'joi'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  '_flags' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema => async (data: unknown) => {
    const result = schema.validate(data);
    if (result.error == null) {
      return {data: result.value};
    }
    return {
      issues: result.error.details.map(
        ({message, path}) => new ValidationIssue(message, path),
      ),
    };
  },
);

import type {Resolver} from '../resolver';
import type {ValidationResult} from '../validation';
import type {Coerce, CreateValidate} from '.';
import type {AnySchema} from 'joi';

import {isJSONSchema, isTypeBoxSchema} from '../utils';

export interface JoiResolver extends Resolver {
  base: AnySchema;
}

const coerce: Coerce<'joi'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  '_flags' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema =>
    async (data: unknown): Promise<ValidationResult> => {
      const result = schema.validate(data);
      if (result.error == null) {
        return {
          data: result.value,
          success: true,
        };
      }
      return {
        issues: result.error.details.map(({message, path}) => ({
          message,
          path,
        })),
        success: false,
      };
    },
);

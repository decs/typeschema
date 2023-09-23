import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {AnySchema} from 'npm:joi@17.10.2';

import {isJSONSchema, isTypeBoxSchema} from '../utils.ts';

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

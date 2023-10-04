import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {Runtype, Static} from 'npm:runtypes@6.7.0';

import {isJSONSchema, isTypeBoxSchema} from '../utils.ts';

export interface RuntypesResolver extends Resolver {
  base: Runtype;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
}

const coerce: Coerce<'runtypes'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'reflect' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema =>
    async (data: unknown): Promise<ValidationResult> => {
      const result = schema.validate(data);
      if (result.success) {
        return {
          data: result.value,
          success: true,
        };
      }
      return {
        issues: [{message: result.message}],
        success: false,
      };
    },
);
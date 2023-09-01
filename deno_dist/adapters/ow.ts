import type {Resolver} from '../resolver.ts';
import type {ValidationResult} from '../validation.ts';
import type {Coerce, CreateValidate} from './index.ts';
import type {Infer, Predicate} from 'npm:ow@0.28.2';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils.ts';

export interface OwResolver extends Resolver {
  base: Predicate;
  input: this['schema'] extends Predicate ? Infer<this['schema']> : never;
  output: this['schema'] extends Predicate ? Infer<this['schema']> : never;
}

export const fetchModule = /* @__PURE__ */ memoize(
  () => import('./modules/ow.ts'),
);

const coerce: Coerce<'ow'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  'context' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(async schema => {
  const {ow, ArgumentError} = await fetchModule();
  const assertSchema = ow.create(schema);
  return async (data: unknown): Promise<ValidationResult> => {
    try {
      assertSchema(data);
      return {
        data,
        success: true,
      };
    } catch (error) {
      if (error instanceof ArgumentError) {
        return {
          issues: Array.from(error.validationErrors.values()).flatMap(
            messages => Array.from(messages).map(message => ({message})),
          ),
          success: false,
        };
      }
      throw error;
    }
  };
});

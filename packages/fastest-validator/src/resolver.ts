import type {IfDefined, Resolver} from '@typeschema/core';
import type {ValidationSchema} from 'fastest-validator';

export interface AdapterResolver extends Resolver {
  base: IfDefined<ValidationSchema, 'fastest-validator'>;
  input: unknown;
  output: unknown;
}

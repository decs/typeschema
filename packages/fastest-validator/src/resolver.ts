import type {IfDefined, Resolver} from '@typeschema/core';
import type {ValidationSchema} from 'fastest-validator';

export interface AdapterResolver extends Resolver {
  base: IfDefined<ValidationSchema, 'fastest-validator'>;
  input: this['schema'] extends this['base'] ? unknown : never;
  output: this['schema'] extends this['base'] ? unknown : never;
}

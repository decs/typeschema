import type {Resolver} from '@typeschema/core';
import type {input, output, ZodType} from 'zod';

export interface AdapterResolver extends Resolver {
  base: ZodType;
  input: this['schema'] extends this['base'] ? input<this['schema']> : never;
  output: this['schema'] extends this['base'] ? output<this['schema']> : never;
}

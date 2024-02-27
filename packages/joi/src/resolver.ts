import type {Resolver} from '@typeschema/core';
import type {AnySchema} from 'joi';

export interface AdapterResolver extends Resolver {
  base: AnySchema;
  input: this['schema'] extends this['base'] ? unknown : never;
  output: this['schema'] extends this['base'] ? unknown : never;
}

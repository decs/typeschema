import type {IfDefined, Resolver} from '@typeschema/core';
import type {AnySchema} from 'joi';

export interface AdapterResolver extends Resolver {
  base: IfDefined<AnySchema, 'joi'>;
  input: this['schema'] extends this['base'] ? unknown : never;
  output: this['schema'] extends this['base'] ? unknown : never;
}

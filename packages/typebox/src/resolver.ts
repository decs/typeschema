import type {Static, TSchema} from '@sinclair/typebox';
import type {IfDefined, Resolver} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: IfDefined<TSchema, '@sinclair/typebox'>;
  input: this['schema'] extends this['base'] ? Static<this['schema']> : never;
  output: this['schema'] extends this['base'] ? Static<this['schema']> : never;
}

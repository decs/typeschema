import type {Static, TSchema} from '@sinclair/typebox';
import type {Resolver} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: TSchema;
  input: this['schema'] extends this['base'] ? Static<this['schema']> : never;
  output: this['schema'] extends this['base'] ? Static<this['schema']> : never;
}

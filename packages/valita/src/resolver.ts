import type {Infer, Type} from '@badrap/valita';
import type {IfDefined, Resolver} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Type, '@badrap/valita'>;
  input: this['schema'] extends this['base'] ? Infer<this['schema']> : unknown;
  output: this['schema'] extends this['base'] ? Infer<this['schema']> : unknown;
}

import type {AdapterResolvers} from './adapters';
import type {Select} from './selector';
import type {
  InputFrom,
  OutputFrom,
  Resolver,
  SchemaFrom,
} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: {
    [TModule in keyof AdapterResolvers]: SchemaFrom<AdapterResolvers[TModule]>;
  }[keyof AdapterResolvers];
  input: InputFrom<AdapterResolvers[Select<this['schema']>], this['schema']>;
  output: OutputFrom<AdapterResolvers[Select<this['schema']>], this['schema']>;
}

import type {AdapterResolverMap} from './adapters';
import type {Select} from './selector';
import type {
  InputFrom,
  OutputFrom,
  Resolver,
  SchemaFrom,
} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: {
    [TModule in keyof AdapterResolverMap]: SchemaFrom<
      AdapterResolverMap[TModule]
    >;
  }[keyof AdapterResolverMap];
  input: InputFrom<AdapterResolverMap[Select<this['schema']>], this['schema']>;
  output: OutputFrom<
    AdapterResolverMap[Select<this['schema']>],
    this['schema']
  >;
}

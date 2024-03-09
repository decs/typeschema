import type {AdapterResolvers} from './adapters';
import type {SchemaKind} from './selector';
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
  input: InputFrom<
    AdapterResolvers[SchemaKind<this['schema']>],
    this['schema']
  >;
  output: OutputFrom<
    AdapterResolvers[SchemaKind<this['schema']>],
    this['schema']
  >;
}

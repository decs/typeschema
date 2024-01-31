import type {Input, Output, Resolver, Schema} from '@typeschema/core';
import type {AdapterResolver as ValibotResolver} from '@typeschema/valibot';
import type {AdapterResolver as ZodResolver} from '@typeschema/zod';

type Resolvers = ValibotResolver | ZodResolver;

export interface AdapterResolver extends Resolver {
  base: Schema<Resolvers>;
  input: this['schema'] extends this['base']
    ? Input<Resolvers, this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? Output<Resolvers, this['schema']>
    : never;
}

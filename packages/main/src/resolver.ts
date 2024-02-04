/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver as ArktypeResolver} from '@typeschema/arktype';
import type {Input, Output, Resolver, Schema} from '@typeschema/core';
import type {AdapterResolver as ValibotResolver} from '@typeschema/valibot';
import type {AdapterResolver as ZodResolver} from '@typeschema/zod';

export type AdapterResolverMap = {
  arktype: ArktypeResolver;
  valibot: ValibotResolver;
  zod: ZodResolver;
};

type AdapterResolvers = AdapterResolverMap[keyof AdapterResolverMap];

export interface AdapterResolver extends Resolver {
  base: Schema<AdapterResolvers>;
  input: this['schema'] extends this['base']
    ? Input<AdapterResolvers, this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? Output<AdapterResolvers, this['schema']>
    : never;
}

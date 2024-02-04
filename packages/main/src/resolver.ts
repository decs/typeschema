/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver as ArktypeResolver} from '@typeschema/arktype';
import type {Input, Output, Resolver, Schema} from '@typeschema/core';
import type {AdapterResolver as IoTsResolver} from '@typeschema/io-ts';
import type {AdapterResolver as JoiResolver} from '@typeschema/joi';
import type {AdapterResolver as SuperstructResolver} from '@typeschema/superstruct';
import type {AdapterResolver as TypeboxResolver} from '@typeschema/typebox';
import type {AdapterResolver as ValibotResolver} from '@typeschema/valibot';
import type {AdapterResolver as YupResolver} from '@typeschema/yup';
import type {AdapterResolver as ZodResolver} from '@typeschema/zod';

export type AdapterResolverMap = {
  arktype: ArktypeResolver;
  ioTs: IoTsResolver;
  joi: JoiResolver;
  superstruct: SuperstructResolver;
  typebox: TypeboxResolver;
  valibot: ValibotResolver;
  yup: YupResolver;
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

/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver as ArktypeResolver} from '@typeschema/arktype';
import type {AdapterResolver as ClassValidatorResolver} from '@typeschema/class-validator';
import type {
  InputFrom,
  OutputFrom,
  Resolver,
  SchemaFrom,
} from '@typeschema/core';
import type {AdapterResolver as DeepkitResolver} from '@typeschema/deepkit';
import type {AdapterResolver as EffectResolver} from '@typeschema/effect';
import type {AdapterResolver as FunctionResolver} from '@typeschema/function';
import type {AdapterResolver as IoTsResolver} from '@typeschema/io-ts';
import type {AdapterResolver as JoiResolver} from '@typeschema/joi';
import type {AdapterResolver as JsonResolver} from '@typeschema/json';
import type {AdapterResolver as OwResolver} from '@typeschema/ow';
import type {AdapterResolver as RuntypesResolver} from '@typeschema/runtypes';
import type {AdapterResolver as SuperstructResolver} from '@typeschema/superstruct';
import type {AdapterResolver as TypeboxResolver} from '@typeschema/typebox';
import type {AdapterResolver as ValibotResolver} from '@typeschema/valibot';
import type {AdapterResolver as YupResolver} from '@typeschema/yup';
import type {AdapterResolver as ZodResolver} from '@typeschema/zod';

export type AdapterResolverMap = {
  arktype: ArktypeResolver;
  classValidator: ClassValidatorResolver;
  deepkit: DeepkitResolver;
  effect: EffectResolver;
  function: FunctionResolver;
  ioTs: IoTsResolver;
  joi: JoiResolver;
  json: JsonResolver;
  ow: OwResolver;
  runtypes: RuntypesResolver;
  superstruct: SuperstructResolver;
  typebox: TypeboxResolver;
  valibot: ValibotResolver;
  yup: YupResolver;
  zod: ZodResolver;
};

export interface AdapterResolver extends Resolver {
  base: {
    [Adapter in keyof AdapterResolverMap]: SchemaFrom<
      AdapterResolverMap[Adapter]
    >;
  }[keyof AdapterResolverMap];
  input: {
    [Adapter in keyof AdapterResolverMap]: this['schema'] extends SchemaFrom<
      AdapterResolverMap[Adapter]
    >
      ? InputFrom<AdapterResolverMap[Adapter], this['schema']>
      : never;
  }[keyof AdapterResolverMap];
  output: {
    [Adapter in keyof AdapterResolverMap]: this['schema'] extends SchemaFrom<
      AdapterResolverMap[Adapter]
    >
      ? OutputFrom<AdapterResolverMap[Adapter], this['schema']>
      : never;
  }[keyof AdapterResolverMap];
}

/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver as AjvResolver} from '@typeschema/ajv';
import type {AdapterResolver as ArktypeResolver} from '@typeschema/arktype';
import type {
  IfDefined,
  Input,
  Output,
  Resolver,
  Schema,
  UnknownIfNever,
} from '@typeschema/core';
import type {AdapterResolver as EffectResolver} from '@typeschema/effect';
import type {AdapterResolver as IoTsResolver} from '@typeschema/io-ts';
import type {AdapterResolver as JoiResolver} from '@typeschema/joi';
import type {AdapterResolver as RuntypesResolver} from '@typeschema/runtypes';
import type {AdapterResolver as SuperstructResolver} from '@typeschema/superstruct';
import type {AdapterResolver as TypeboxResolver} from '@typeschema/typebox';
import type {AdapterResolver as ValibotResolver} from '@typeschema/valibot';
import type {AdapterResolver as YupResolver} from '@typeschema/yup';
import type {AdapterResolver as ZodResolver} from '@typeschema/zod';

export type AdapterResolverMap = {
  ajv: AjvResolver;
  arktype: ArktypeResolver;
  effect: EffectResolver;
  ioTs: IoTsResolver;
  joi: JoiResolver;
  runtypes: RuntypesResolver;
  superstruct: SuperstructResolver;
  typebox: TypeboxResolver;
  valibot: ValibotResolver;
  yup: YupResolver;
  zod: ZodResolver;
};

export interface AdapterResolver extends Resolver {
  base: {
    [Adapter in keyof AdapterResolverMap]: IfDefined<
      Schema<AdapterResolverMap[Adapter]>
    >;
  }[keyof AdapterResolverMap];
  input: UnknownIfNever<
    {
      [Adapter in keyof AdapterResolverMap]: IfDefined<
        this['schema'] extends IfDefined<AdapterResolverMap[Adapter]['base']>
          ? Input<AdapterResolverMap[Adapter], this['schema']>
          : never
      >;
    }[keyof AdapterResolverMap]
  >;
  output: UnknownIfNever<
    {
      [Adapter in keyof AdapterResolverMap]: IfDefined<
        this['schema'] extends IfDefined<AdapterResolverMap[Adapter]['base']>
          ? Output<AdapterResolverMap[Adapter], this['schema']>
          : never
      >;
    }[keyof AdapterResolverMap]
  >;
}

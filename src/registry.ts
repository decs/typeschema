import {wrap} from './adapters';
import * as ajv from './adapters/ajv';
import * as arktype from './adapters/arktype';
import * as custom from './adapters/custom';
import * as deepkit from './adapters/deepkit';
import * as effect from './adapters/effect';
import * as ioTs from './adapters/io-ts';
import * as joi from './adapters/joi';
import * as ow from './adapters/ow';
import * as runtypes from './adapters/runtypes';
import * as superstruct from './adapters/superstruct';
import * as typebox from './adapters/typebox';
import * as valibot from './adapters/valibot';
import * as yup from './adapters/yup';
import * as zod from './adapters/zod';

export type Registry = {
  ajv: ajv.AjvResolver;
  arktype: arktype.ArkTypeResolver;
  custom: custom.CustomResolver;
  deepkit: deepkit.DeepkitResolver;
  effect: effect.EffectResolver;
  'io-ts': ioTs.IoTsResolver;
  joi: joi.JoiResolver;
  ow: ow.OwResolver;
  runtypes: runtypes.RuntypesResolver;
  superstruct: superstruct.SuperstructResolver;
  typebox: typebox.TypeBoxResolver;
  valibot: valibot.ValibotResolver;
  yup: yup.YupResolver;
  zod: zod.ZodResolver;
};

export const createValidate = /* @__PURE__ */ wrap([
  ajv.createValidate,
  arktype.createValidate,
  effect.createValidate,
  custom.createValidate,
  deepkit.createValidate,
  ioTs.createValidate,
  joi.createValidate,
  ow.createValidate,
  runtypes.createValidate,
  superstruct.createValidate,
  typebox.createValidate,
  valibot.createValidate,
  yup.createValidate,
  zod.createValidate,
]);

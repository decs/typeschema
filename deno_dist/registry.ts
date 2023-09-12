import {wrap} from './adapters/index.ts';
import * as ajv from './adapters/ajv.ts';
import * as arktype from './adapters/arktype.ts';
import * as custom from './adapters/custom.ts';
import * as deepkit from './adapters/deepkit.ts';
import * as effect from './adapters/effect.ts';
import * as ioTs from './adapters/io-ts.ts';
import * as joi from './adapters/joi.ts';
import * as ow from './adapters/ow.ts';
import * as runtypes from './adapters/runtypes.ts';
import * as superstruct from './adapters/superstruct.ts';
import * as typebox from './adapters/typebox.ts';
import * as valibot from './adapters/valibot.ts';
import * as yup from './adapters/yup.ts';
import * as zod from './adapters/zod.ts';

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
  custom.createValidate,
  deepkit.createValidate,
  effect.createValidate,
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

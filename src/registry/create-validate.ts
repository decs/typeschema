import {wrap} from '../adapters';
import * as ajv from '../adapters/ajv';
import * as arktype from '../adapters/arktype';
import * as custom from '../adapters/custom';
import * as deepkit from '../adapters/deepkit';
import * as ioTs from '../adapters/io-ts';
import * as joi from '../adapters/joi';
import * as ow from '../adapters/ow';
import * as runtypes from '../adapters/runtypes';
import * as superstruct from '../adapters/superstruct';
import * as typebox from '../adapters/typebox';
import * as valibot from '../adapters/valibot';
import * as yup from '../adapters/yup';
import * as zod from '../adapters/zod';

export const createValidate = wrap([
  ajv.createValidate,
  arktype.createValidate,
  deepkit.createValidate,
  custom.createValidate,
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

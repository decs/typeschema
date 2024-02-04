/**
 * This file is generated. Do not modify it manually!
 */

import type {Input, Output, Schema} from '@typeschema/core';

import {createAssert, createValidate, createWrap} from '@typeschema/core';

import {AdapterResolver} from './resolver';
import {validationAdapter} from './validation';

export type Infer<TSchema extends Schema<AdapterResolver>> = Output<
  AdapterResolver,
  TSchema
>;
export type InferIn<TSchema extends Schema<AdapterResolver>> = Input<
  AdapterResolver,
  TSchema
>;

export const validate = createValidate(validationAdapter);
export const assert = createAssert(validate);
export const wrap = createWrap(assert, validate);

export {AdapterResolver, validationAdapter};

import type {AdapterResolver} from './adapter';
import type {Input, Output, Schema} from '@typeschema/core';

import {createAssert, createValidate, createWrap} from '@typeschema/core';

import {validationAdapter} from './adapter';

export {AdapterResolver, validationAdapter};

export type Infer<TSchema extends Schema<AdapterResolver>> = Output<
  AdapterResolver,
  TSchema
>;

export type InferIn<TSchema extends Schema<AdapterResolver>> = Input<
  AdapterResolver,
  TSchema
>;

export const validate = createValidate(validationAdapter);

export const assert = createAssert(validationAdapter);

export const wrap = createWrap(validationAdapter);

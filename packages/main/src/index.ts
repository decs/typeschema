/**
 * This file is generated. Do not modify it manually!
 */

import type {Input, Output, Schema, UnknownIfNever} from '@typeschema/core';

import {
  createAssert,
  createToJSONSchema,
  createValidate,
  createWrap,
} from '@typeschema/core';

import {AdapterResolver} from './resolver';
import {serializationAdapter} from './serialization';
import {validationAdapter} from './validation';

export type Infer<TSchema extends Schema<AdapterResolver>> = UnknownIfNever<
  Output<AdapterResolver, TSchema>
>;
export type InferIn<TSchema extends Schema<AdapterResolver>> = UnknownIfNever<
  Input<AdapterResolver, TSchema>
>;

export const validate = createValidate(validationAdapter);
export const assert = createAssert(validate);
export const wrap = createWrap(assert, validate);

export const toJSONSchema = createToJSONSchema(serializationAdapter);

export {
  AdapterResolver,
  serializationAdapter,
  validationAdapter,
};

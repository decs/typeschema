/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {memoize, unsupportedAdapter} from '@typeschema/core';

import {select} from './selector';

const importValibotSerializationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/valibot';
    const {serializationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/valibot');
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

const importYupSerializationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/yup';
    const {serializationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/yup');
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

const importZodSerializationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/zod';
    const {serializationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/zod');
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

export const serializationAdapter: SerializationAdapter<AdapterResolver> = select({
  ajv: unsupportedAdapter('@typeschema/ajv'),
  arktype: unsupportedAdapter('@typeschema/arktype'),
  deepkit: unsupportedAdapter('@typeschema/deepkit'),
  effect: unsupportedAdapter('@typeschema/effect'),
  function: unsupportedAdapter('@typeschema/function'),
  ioTs: unsupportedAdapter('@typeschema/io-ts'),
  joi: unsupportedAdapter('@typeschema/joi'),
  ow: unsupportedAdapter('@typeschema/ow'),
  runtypes: unsupportedAdapter('@typeschema/runtypes'),
  superstruct: unsupportedAdapter('@typeschema/superstruct'),
  typebox: unsupportedAdapter('@typeschema/typebox'),
  valibot: async schema => (await importValibotSerializationAdapter())(schema),
  yup: async schema => (await importYupSerializationAdapter())(schema),
  zod: async schema => (await importZodSerializationAdapter())(schema),
});

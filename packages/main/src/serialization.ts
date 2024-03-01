/**
 * This file is generated. Do not modify it manually!
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {AdapterResolvers} from './adapters';
import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {memoize, unsupportedAdapter} from '@typeschema/core';

import {select} from './selector';

const importJsonSerializationAdapter = memoize(async () => {
  const {serializationAdapter} = await import('@typeschema/json');
  return serializationAdapter;
});

const importValibotSerializationAdapter = memoize(async () => {
  const {serializationAdapter} = await import('@typeschema/valibot');
  return serializationAdapter;
});

const importYupSerializationAdapter = memoize(async () => {
  const {serializationAdapter} = await import('@typeschema/yup');
  return serializationAdapter;
});

const importZodSerializationAdapter = memoize(async () => {
  const {serializationAdapter} = await import('@typeschema/zod');
  return serializationAdapter;
});

export const serializationAdapter: SerializationAdapter<AdapterResolver> = select({
  arktype: unsupportedAdapter<AdapterResolvers['arktype']>('@typeschema/arktype'),
  classValidator: unsupportedAdapter<AdapterResolvers['classValidator']>('@typeschema/class-validator'),
  deepkit: unsupportedAdapter<AdapterResolvers['deepkit']>('@typeschema/deepkit'),
  effect: unsupportedAdapter<AdapterResolvers['effect']>('@typeschema/effect'),
  function: unsupportedAdapter<AdapterResolvers['function']>('@typeschema/function'),
  ioTs: unsupportedAdapter<AdapterResolvers['ioTs']>('@typeschema/io-ts'),
  joi: unsupportedAdapter<AdapterResolvers['joi']>('@typeschema/joi'),
  json: async schema => (await importJsonSerializationAdapter())(schema),
  ow: unsupportedAdapter<AdapterResolvers['ow']>('@typeschema/ow'),
  runtypes: unsupportedAdapter<AdapterResolvers['runtypes']>('@typeschema/runtypes'),
  superstruct: unsupportedAdapter<AdapterResolvers['superstruct']>('@typeschema/superstruct'),
  typebox: unsupportedAdapter<AdapterResolvers['typebox']>('@typeschema/typebox'),
  valibot: async schema => (await importValibotSerializationAdapter())(schema),
  yup: async schema => (await importYupSerializationAdapter())(schema),
  zod: async schema => (await importZodSerializationAdapter())(schema),
});

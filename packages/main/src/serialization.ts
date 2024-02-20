/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

import {select} from './selector';

const importValibotSerializationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/valibot';
    const {serializationAdapter} = await import(
      /* webpackIgnore: true */ moduleName
    );
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

const importYupSerializationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/yup';
    const {serializationAdapter} = await import(
      /* webpackIgnore: true */ moduleName
    );
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

const importZodSerializationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/zod';
    const {serializationAdapter} = await import(
      /* webpackIgnore: true */ moduleName
    );
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

export const serializationAdapter: SerializationAdapter<AdapterResolver> = select({
  ajv: async () => {
    throw new Error('Unsupported');
  },
  arktype: async () => {
    throw new Error('Unsupported');
  },
  deepkit: async () => {
    throw new Error('Unsupported');
  },
  effect: async () => {
    throw new Error('Unsupported');
  },
  function: async () => {
    throw new Error('Unsupported');
  },
  ioTs: async () => {
    throw new Error('Unsupported');
  },
  joi: async () => {
    throw new Error('Unsupported');
  },
  ow: async () => {
    throw new Error('Unsupported');
  },
  runtypes: async () => {
    throw new Error('Unsupported');
  },
  superstruct: async () => {
    throw new Error('Unsupported');
  },
  typebox: async () => {
    throw new Error('Unsupported');
  },
  valibot: async schema => (await importValibotSerializationAdapter())(schema),
  yup: async schema => (await importYupSerializationAdapter())(schema),
  zod: async schema => (await importZodSerializationAdapter())(schema),
});

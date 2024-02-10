/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

import {select} from './selector';

const importValibotSerializationAdapter = memoize(async () => {
  try {
    const {serializationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/valibot'
    );
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

const importYupSerializationAdapter = memoize(async () => {
  try {
    const {serializationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/yup'
    );
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

const importZodSerializationAdapter = memoize(async () => {
  try {
    const {serializationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/zod'
    );
    return serializationAdapter;
  } catch (error) {
    throw error;
  }
});

export const serializationAdapter: SerializationAdapter<AdapterResolver> = select({
  ajv: async _schema => {
    throw new Error('Unsupported');
  },
  arktype: async _schema => {
    throw new Error('Unsupported');
  },
  deepkit: async _schema => {
    throw new Error('Unsupported');
  },
  effect: async _schema => {
    throw new Error('Unsupported');
  },
  function: async _schema => {
    throw new Error('Unsupported');
  },
  ioTs: async _schema => {
    throw new Error('Unsupported');
  },
  joi: async _schema => {
    throw new Error('Unsupported');
  },
  ow: async _schema => {
    throw new Error('Unsupported');
  },
  runtypes: async _schema => {
    throw new Error('Unsupported');
  },
  superstruct: async _schema => {
    throw new Error('Unsupported');
  },
  typebox: async _schema => {
    throw new Error('Unsupported');
  },
  valibot: async schema => (await importValibotSerializationAdapter())(schema),
  yup: async schema => (await importYupSerializationAdapter())(schema),
  zod: async schema => (await importZodSerializationAdapter())(schema),
});

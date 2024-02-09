import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  try {
    const {toJSONSchema} = await import(
      /* webpackIgnore: true */ '@gcornut/valibot-json-schema'
    );
    return {toJSONSchema};
  } catch (error) {
    throw error;
  }
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {toJSONSchema} = await importSerializationModule();
  return toJSONSchema({schema});
};

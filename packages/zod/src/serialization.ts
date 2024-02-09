import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  try {
    const {zodToJsonSchema} = await import(
      /* webpackIgnore: true */ 'zod-to-json-schema'
    );
    return {zodToJsonSchema};
  } catch (error) {
    throw error;
  }
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {zodToJsonSchema} = await importSerializationModule();
  return zodToJsonSchema(schema);
};

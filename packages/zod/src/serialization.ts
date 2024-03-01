import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  const {zodToJsonSchema} = await import('zod-to-json-schema');
  return {zodToJsonSchema};
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {zodToJsonSchema} = await importSerializationModule();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return zodToJsonSchema(schema) as any;
};

import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  const {toJSONSchema} = await import('@gcornut/valibot-json-schema');
  return {toJSONSchema};
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {toJSONSchema} = await importSerializationModule();
  return toJSONSchema({schema});
};

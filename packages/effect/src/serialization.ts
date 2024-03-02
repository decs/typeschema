import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  const {make} = await import('@effect/schema/JSONSchema');
  return {make};
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {make} = await importSerializationModule();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return make(schema) as any;
};

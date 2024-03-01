import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  const {default: parse} = await import('joi-to-json');
  return {parse};
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {parse} = await importSerializationModule();
  return parse(schema);
};

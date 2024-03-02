import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  const {extractSingleJsonSchema} = await import('suretype');
  return {extractSingleJsonSchema};
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {extractSingleJsonSchema} = await importSerializationModule();
  return extractSingleJsonSchema(schema).schema;
};

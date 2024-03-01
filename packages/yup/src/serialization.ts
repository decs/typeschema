import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  const {convertSchema} = await import('@sodaru/yup-to-json-schema');
  return {convertSchema};
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {convertSchema} = await importSerializationModule();
  return convertSchema(schema);
};

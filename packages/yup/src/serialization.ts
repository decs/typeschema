import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

const importSerializationModule = memoize(async () => {
  try {
    const moduleName = '@sodaru/yup-to-json-schema';
    const {convertSchema} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@sodaru/yup-to-json-schema');
    return {convertSchema};
  } catch (error) {
    throw error;
  }
});

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => {
  const {convertSchema} = await importSerializationModule();
  return convertSchema(schema);
};

import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
> = async schema => schema;

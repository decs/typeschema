import type {AdapterResolver} from './resolver';
import type {SerializationAdapter} from '@typeschema/core';

export const serializationAdapter: SerializationAdapter<
  AdapterResolver
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = async schema => schema as any;

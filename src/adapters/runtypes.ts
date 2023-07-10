import type {Schema, WrappedSchema} from './adapter-registry';
import type {TypeSchemaResolver} from './type-resolver';
import type {Failure, Runtype, Static} from 'runtypes';

import {maybe} from '../utils';
import {registerAdapter} from './adapter-registry';

declare global {
  export interface SchemaAdapterRegistry {
    runype: RuntypeResolver;
  }
}
interface RuntypeResolver extends TypeSchemaResolver {
  base: Runtype<this['type']>;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
  error: Failure;
}

async function wrap<T>(schema: Schema<T>): Promise<WrappedSchema<T> | null> {
  const Runtypes = await maybe(() => import('runtypes'));
  if (Runtypes == null) {
    return null;
  }
  if (!('reflect' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies Runtype<T>;
  return {
    assert: async data => schema.check(data),
  };
}

registerAdapter(wrap);

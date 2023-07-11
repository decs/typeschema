import type {Schema, TypeSchema} from '../registry';
import type {TypeSchemaResolver} from '../resolver';
import type {Failure, Runtype, Static} from 'runtypes';

import {register} from '../registry';
import {maybe} from '../utils';

interface RuntypeResolver extends TypeSchemaResolver {
  base: Runtype<this['type']>;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
  error: Failure;
}

async function wrap<T>(schema: Schema<T>): Promise<TypeSchema<T> | null> {
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

declare global {
  export interface TypeSchemaRegistry {
    runtype: RuntypeResolver;
  }
}
register(wrap);

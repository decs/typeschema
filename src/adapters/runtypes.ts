import type {Schema} from '../registry';
import type {InferSchema, TypeSchemaResolver} from '../resolver';
import type {Failure, Runtype, Static} from 'runtypes';

import {register} from '../registry';
import {maybe} from '../utils';

interface RuntypesResolver extends TypeSchemaResolver {
  base: Runtype<this['type']>;
  input: this['schema'] extends Runtype ? Static<this['schema']> : never;
  output: this['schema'] extends Runtype ? Static<this['schema']> : never;
  error: Failure;
}

declare global {
  export interface TypeSchemaRegistry {
    runtypes: RuntypesResolver;
  }
}

register(async <T>(schema: Schema<T>) => {
  const Runtypes = await maybe(() => import('runtypes'));
  if (Runtypes == null) {
    return null;
  }
  if (!('reflect' in schema) || 'static' in schema) {
    return null;
  }
  schema satisfies InferSchema<RuntypesResolver, T>;
  return {
    assert: async data => schema.check(data),
  };
});

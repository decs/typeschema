import type {TypeSchemaResolver} from '../resolver';
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

register<'runtypes'>(
  async schema => {
    const Runtypes = await maybe(() => import('runtypes'));
    if (Runtypes == null) {
      return null;
    }
    if (!('reflect' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  schema => ({
    assert: async data => schema.check(data),
  }),
);

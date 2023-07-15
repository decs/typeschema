import type {TypeSchemaResolver} from '../resolver';
import type {Failure, Runtype, Static} from 'runtypes';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {maybe} from '../utils';

interface RuntypesResolver extends TypeSchemaResolver {
  base: Runtype;
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
    validate: async data => {
      const result = schema.validate(data);
      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- needed because schema can't be resolved to a specific type
        return {data: result.value as any};
      }
      return {issues: [new ValidationIssue(result.message)]};
    },
  }),
);

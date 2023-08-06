import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Type} from '@deepkit/type';

import {isJSONSchema, isTypeBoxSchema, maybe} from '../utils';
import {ValidationIssue} from '../validation';

interface DeepkitResolver extends Resolver {
  base: Type;
  module: typeof import('@deepkit/type');
}

declare global {
  export interface TypeSchemaRegistry {
    deepkit: DeepkitResolver;
  }
}

export const init: Adapter<'deepkit'>['init'] = async () =>
  maybe(() => import('@deepkit/type'));

export const guard: Adapter<'deepkit'>['guard'] = schema =>
  'kind' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const validate: Adapter<'deepkit'>['validate'] =
  (schema, {validate: validateSchema}) =>
  async data => {
    const result = validateSchema(data, schema);
    if (result.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {data: data as any};
    }
    return {
      issues: result.map(
        ({message, path}) => new ValidationIssue(message, [path]),
      ),
    };
  };

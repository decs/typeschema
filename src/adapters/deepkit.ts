import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {Type} from '@deepkit/type';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface DeepkitResolver extends Resolver {
  base: Type;
}

const fetchModule = memoize(async () => {
  const {validate} = await import('@deepkit/type');
  return {validate};
});

export const coerce: Adapter<'deepkit'>['coerce'] = schema =>
  'kind' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'deepkit'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    const {validate} = await fetchModule();
    return async data => {
      const result = validate(data, coercedSchema);
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
  };

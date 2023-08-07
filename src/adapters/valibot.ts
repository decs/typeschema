import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {BaseSchema, BaseSchemaAsync, Input, Output} from 'valibot';

import {isJSONSchema, isTypeBoxSchema, memoize} from '../utils';
import {ValidationIssue} from '../validation';

export interface ValibotResolver extends Resolver {
  base: BaseSchema | BaseSchemaAsync;
  input: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Input<this['schema']>
    : never;
  output: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Output<this['schema']>
    : never;
}

const fetchModule = memoize(async () => {
  const {safeParseAsync} = await import('valibot');
  return {safeParseAsync};
});

export const coerce: Adapter<'valibot'>['coerce'] = schema =>
  'async' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'valibot'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    const {safeParseAsync} = await fetchModule();
    return async data => {
      const result = await safeParseAsync(coercedSchema, data);
      if (result.success) {
        return {data: result.data};
      }
      return {
        issues: result.error.issues.map(
          ({message, path}) =>
            new ValidationIssue(message, path?.map(({key}) => key)),
        ),
      };
    };
  };

import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {BaseSchema, BaseSchemaAsync, Input, Output} from 'valibot';

import {isJSONSchema, isTypeBoxSchema, maybeImport} from '../utils';
import {ValidationIssue} from '../validation';

interface ValibotResolver extends Resolver {
  base: BaseSchema | BaseSchemaAsync;
  input: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Input<this['schema']>
    : never;
  output: this['schema'] extends BaseSchema | BaseSchemaAsync
    ? Output<this['schema']>
    : never;
  module: typeof import('valibot');
}

declare global {
  export interface TypeSchemaRegistry {
    valibot: ValibotResolver;
  }
}

export const init: Adapter<'valibot'>['init'] = async () =>
  maybeImport<typeof import('valibot')>('valibot');

export const coerce: Adapter<'valibot'>['coerce'] = schema =>
  'async' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'valibot'>['createValidate'] =
  (schema, {safeParseAsync}) =>
  async data => {
    const result = await safeParseAsync(schema, data);
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

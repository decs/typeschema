import type {Resolver} from '../resolver';
import type {BaseSchema, BaseSchemaAsync, Input, Output} from 'valibot';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

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

register<'valibot'>(
  schema =>
    'async' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
      ? schema
      : null,
  async (schema, {safeParseAsync}) => ({
    validate: async data => {
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
    },
  }),
  'valibot',
);

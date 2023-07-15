import type {TypeSchemaResolver} from '../resolver';
import type {input, output, ZodError, ZodTypeAny} from 'zod';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {maybe} from '../utils';

interface ZodResolver extends TypeSchemaResolver {
  base: ZodTypeAny;
  input: this['schema'] extends ZodTypeAny ? input<this['schema']> : never;
  output: this['schema'] extends ZodTypeAny ? output<this['schema']> : never;
  error: ZodError;
}

declare global {
  export interface TypeSchemaRegistry {
    zod: ZodResolver;
  }
}

register<'zod'>(
  async schema => {
    const Zod = await maybe(() => import('zod'));
    if (Zod == null) {
      return null;
    }
    if (!('_def' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  schema => ({
    validate: async data => {
      const result = await schema.safeParseAsync(data);
      if (result.success) {
        return {data: result.data};
      }
      return {
        issues: result.error.issues.map(
          ({message, path}) => new ValidationIssue(message, path),
        ),
      };
    },
  }),
);

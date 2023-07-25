import type {Resolver} from '../resolver';
import type {input, output, ZodSchema} from 'zod';

import {register} from '../registry';
import {ValidationIssue} from '../schema';
import {isJSONSchema, isTypeBoxSchema} from '../utils';

interface ZodResolver extends Resolver {
  base: ZodSchema<this['type']>;
  input: this['schema'] extends ZodSchema ? input<this['schema']> : never;
  output: this['schema'] extends ZodSchema ? output<this['schema']> : never;
}

declare global {
  export interface TypeSchemaRegistry {
    zod: ZodResolver;
  }
}

register<'zod'>(
  async schema => {
    if (
      !('_def' in schema) ||
      isTypeBoxSchema(schema) ||
      isJSONSchema(schema)
    ) {
      return null;
    }
    return schema;
  },
  async schema => ({
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
  () => import('zod'),
);

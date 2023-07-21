import type {Resolver} from '../resolver';
import type {input, output, ZodSchema} from 'zod';

import {register} from '../registry';
import {Source, ValidationIssue} from '../schema';
import {maybe} from '../utils';

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
    const Zod = await maybe(() => import('zod'));
    if (Zod == null) {
      return null;
    }
    if (!('_def' in schema) || 'static' in schema) {
      return null;
    }
    return schema;
  },
  async schema => ({
    [Source]: schema,
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

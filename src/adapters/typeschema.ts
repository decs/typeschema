import type {Resolver} from '../resolver';
import type {TypeSchema} from '../schema';

import {register} from '../registry';
import {Source} from '../schema';

interface TypeSchemaResolver extends Resolver {
  base: TypeSchema<this['type']>;
  input: this['schema'] extends TypeSchema<infer T> ? T : never;
  output: this['schema'] extends TypeSchema<infer T> ? T : never;
}

declare global {
  export interface TypeSchemaRegistry {
    typeschema: TypeSchemaResolver;
  }
}

register<'typeschema'>(
  async schema => {
    if (!(Source in schema)) {
      return null;
    }
    return schema;
  },
  async schema => schema,
);

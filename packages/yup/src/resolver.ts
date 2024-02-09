import type {Resolver} from '@typeschema/core';
import type {InferType, Schema} from 'yup';
import type {convertSchema} from '@sodaru/yup-to-json-schema';

export interface AdapterResolver extends Resolver {
  base: Schema;
  input: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : never;
  jsonSchema: ReturnType<typeof convertSchema>;
}

import type {Resolver} from '@typeschema/core';
import type {InferType, Schema} from 'yup';

export interface AdapterResolver extends Resolver {
  base: Schema;
  input: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : never;
}

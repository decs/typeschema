import type {IfDefined, Resolver} from '@typeschema/core';
import type {InferType, Schema} from 'yup';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Schema, 'yup'>;
  input: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : never;
  output: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : never;
}

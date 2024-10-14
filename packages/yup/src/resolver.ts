import type {IfDefined, Resolver} from '@typeschema/core';
import type {InferType, Schema} from 'yup';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Schema, 'yup'>;
  input: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : unknown;
  output: this['schema'] extends this['base']
    ? InferType<this['schema']>
    : unknown;
}

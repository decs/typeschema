import type {Type} from '@deepkit/type';
import type {IfDefined, Resolver} from '@typeschema/core';

export interface AdapterResolver extends Resolver {
  base: IfDefined<Type, '@deepkit/type'>;
  input: unknown;
  output: unknown;
}

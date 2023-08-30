import type {Resolver} from '../resolver.ts';
import type {Coerce, CreateValidate} from './index.ts';

type CustomSchema<T = unknown> = (data: unknown) => Promise<T> | T;

export interface CustomResolver extends Resolver {
  base: CustomSchema<this['type']>;
  input: this['schema'] extends CustomSchema
    ? keyof this['schema'] extends never
      ? Awaited<ReturnType<this['schema']>>
      : never
    : never;
  output: this['schema'] extends CustomSchema
    ? keyof this['schema'] extends never
      ? Awaited<ReturnType<this['schema']>>
      : never
    : never;
}

const coerce: Coerce<'custom'> = /* @__NO_SIDE_EFFECTS__ */ fn => schema =>
  typeof schema === 'function' && !('assert' in schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = coerce(
  async schema => async (data: unknown) => {
    try {
      return {data: await schema(data)};
    } catch (error) {
      if (error instanceof Error) {
        return {issues: [{message: error.message}]};
      }
      throw error;
    }
  },
);

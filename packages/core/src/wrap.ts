import type {Input, Output, Resolver, Schema} from './resolver';

import {
  createAssert,
  createValidate,
  type ValidationAdapter,
  type ValidationIssue,
} from './validation';

export type TypeSchema<TOutput, TInput = TOutput> = {
  _input: TInput;
  _output: TOutput;
  assert(data: unknown): Promise<TOutput>;
  parse(data: unknown): Promise<TOutput>;
  validate(
    data: unknown,
  ): Promise<{data: TOutput} | {issues: Array<ValidationIssue>}>;
};

export type WrapFn<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
) => TypeSchema<Output<TResolver, TSchema>, Input<TResolver, TSchema>>;

export function createWrap<TResolver extends Resolver>(
  adapter: ValidationAdapter<TResolver>,
): WrapFn<TResolver> {
  const assert = createAssert<TResolver>(adapter);
  const validate = createValidate<TResolver>(adapter);
  return <TSchema extends Schema<TResolver>>(schema: TSchema) => ({
    _input: undefined as Input<TResolver, TSchema>,
    _output: undefined as Output<TResolver, TSchema>,
    assert: data => assert(schema, data),
    parse: data => assert(schema, data),
    validate: data => validate(schema, data),
  });
}

import type {Input, Output, Resolver, Schema} from './resolver';
import type {Assert, Validate, ValidationIssue} from './validation';

export type TypeSchema<TOutput, TInput = TOutput> = {
  _input: TInput;
  _output: TOutput;
  assert(data: unknown): Promise<TOutput>;
  parse(data: unknown): Promise<TOutput>;
  validate(
    data: unknown,
  ): Promise<{data: TOutput} | {issues: Array<ValidationIssue>}>;
};

export type Wrap<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
) => TypeSchema<Output<TResolver, TSchema>, Input<TResolver, TSchema>>;

export function createWrap<TResolver extends Resolver>(
  assert: Assert<TResolver>,
  validate: Validate<TResolver>,
): Wrap<TResolver> {
  return schema => ({
    _input: undefined,
    _output: undefined,
    assert: data => assert(schema, data),
    parse: data => assert(schema, data),
    validate: data => validate(schema, data),
  });
}

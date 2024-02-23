import type {InputFrom, OutputFrom, Resolver, SchemaFrom} from './resolver';
import type {UnknownIfNever} from './utils';
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
  TSchema extends SchemaFrom<TResolver>,
>(
  schema: TSchema,
) => TypeSchema<
  UnknownIfNever<OutputFrom<TResolver, TSchema>>,
  UnknownIfNever<InputFrom<TResolver, TSchema>>
>;

/* @__NO_SIDE_EFFECTS__ */
export function createWrap<TResolver extends Resolver>(
  assert: Assert<TResolver>,
  validate: Validate<TResolver>,
): Wrap<TResolver> {
  return schema => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _input: undefined as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _output: undefined as any,
    assert: data => assert(schema, data),
    parse: data => assert(schema, data),
    validate: data => validate(schema, data),
  });
}

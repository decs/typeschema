import type {Infer, InferIn} from './inference.ts';
import type {Schema} from './resolver.ts';
import type {ValidationIssue} from './validation.ts';

import {assert, validate} from './validation.ts';

export type TypeSchema<TOutput, TInput = TOutput> = {
  _input: TInput;
  _output: TOutput;
  validate(
    data: unknown,
  ): Promise<{data: TOutput} | {issues: Array<ValidationIssue>}>;
  assert(data: unknown): Promise<TOutput>;
};

export function wrap<TSchema extends Schema>(
  schema: TSchema,
): TypeSchema<Infer<TSchema>, InferIn<TSchema>> {
  return {
    _input: undefined as InferIn<TSchema>,
    _output: undefined as Infer<TSchema>,
    assert: data => assert(schema, data),
    validate: data => validate(schema, data),
  };
}

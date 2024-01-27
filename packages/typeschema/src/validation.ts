import type {Infer} from './inference';
import type {Schema} from './resolver';

import {createValidate} from './registry';

export type ValidationIssue = {
  message: string;
  path?: Array<string | number | symbol>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidationResult<TOutput = any> =
  | {success: true; data: TOutput}
  | {success: false; issues: Array<ValidationIssue>};

export async function validate<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<ValidationResult<Infer<TSchema>>> {
  const validateSchema = await createValidate(schema);
  return validateSchema(data);
}

export async function assert<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<Infer<TSchema>> {
  const result = await validate(schema, data);
  if (result.success) {
    return result.data;
  }
  throw new AggregateError(result.issues, 'Assertion failed');
}

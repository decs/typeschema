import type {Infer} from './inference';
import type {Schema} from './resolver';

import {createValidate} from './registry';

export type ValidationIssue = {
  message: string;
  path?: Array<string | number | symbol>;
};

export async function validate<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<{data: Infer<TSchema>} | {issues: Array<ValidationIssue>}> {
  const validateSchema = await createValidate(schema);
  return validateSchema(data);
}

export async function assert<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<Infer<TSchema>> {
  const result = await validate(schema, data);
  if ('issues' in result) {
    throw new AggregateError(result.issues, 'Assertion failed');
  }
  return result.data;
}

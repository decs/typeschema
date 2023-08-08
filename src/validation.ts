import type {Infer} from './inference';
import type {Schema} from './resolver';

import {createValidate} from './registry';

export class ValidationIssue extends Error {
  constructor(
    message: string,
    public path?: Array<string | number | symbol>,
  ) {
    super(message);
  }
}

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

export function createAssert<TSchema extends Schema>(
  schema: TSchema,
): (data: unknown) => Promise<Infer<TSchema>> {
  return async data => assert(schema, data);
}

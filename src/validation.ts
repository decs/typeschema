import type {Adapter} from './adapters';
import type {Infer} from './inference';
import type {Schema} from './resolver';

import {cachedAdapters, findAdapter} from './adapters';

type ValidationResult<TSchema extends Schema> =
  | {data: Infer<TSchema>}
  | {issues: Array<ValidationIssue>};

export class ValidationIssue extends Error {
  constructor(
    message: string,
    public path?: Array<string | number | symbol>,
  ) {
    super(message);
  }
}

const cachedCreateValidates = new Map<
  Schema,
  ReturnType<Adapter['createValidate']>
>();

export async function validate<TSchema extends Schema>(
  schema: TSchema,
  data: unknown,
): Promise<ValidationResult<TSchema>> {
  const cachedCreateValidate = cachedCreateValidates.get(schema);
  if (cachedCreateValidate != null) {
    return (await cachedCreateValidate(data)) as ValidationResult<TSchema>;
  }

  const {createValidate, module} =
    cachedAdapters.get(schema) ?? (await findAdapter(schema));
  const validateSchema = createValidate<Infer<TSchema>>(schema, module);

  cachedCreateValidates.set(schema, validateSchema);
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

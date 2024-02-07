import type {Output, Resolver, Schema} from './resolver';

import {memoizeWithKey} from './utils';

export type ValidationIssue = {
  message: string;
  path?: Array<string | number | symbol>;
};

export type ValidationResult<TOutput> =
  | {success: true; data: TOutput}
  | {success: false; issues: Array<ValidationIssue>};

export type ValidationAdapter<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
) => Promise<
  (data: unknown) => Promise<ValidationResult<Output<TResolver, TSchema>>>
>;

export type Validate<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
  data: unknown,
) => Promise<ValidationResult<Output<TResolver, TSchema>>>;

export function createValidate<TResolver extends Resolver>(
  validationAdapter: ValidationAdapter<TResolver>,
): Validate<TResolver> {
  const memoizedValidationAdapter = memoizeWithKey(
    (schema: Schema<TResolver>) => validationAdapter(schema),
  );
  return async (schema, data) => {
    const validateSchema = await memoizedValidationAdapter(schema);
    return validateSchema(data);
  };
}

export type Assert<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
  data: unknown,
) => Promise<Output<TResolver, TSchema>>;

export function createAssert<TResolver extends Resolver>(
  validate: Validate<TResolver>,
): Assert<TResolver> {
  return async (schema, data) => {
    const result = await validate(schema, data);
    if (result.success) {
      return result.data;
    }
    throw new AggregateError(result.issues, 'Assertion failed');
  };
}

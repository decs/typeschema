import type {Output, Resolver, Schema} from './resolver';

export type ValidationIssue = {
  message: string;
  path?: Array<string | number | symbol>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidationResult<TOutput = any> =
  | {success: true; data: TOutput}
  | {success: false; issues: Array<ValidationIssue>};

export type ValidationAdapter<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
) => Promise<
  (data: unknown) => Promise<ValidationResult<Output<TResolver, TSchema>>>
>;

export type ValidateFn<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
  data: unknown,
) => Promise<ValidationResult<Output<TResolver, TSchema>>>;

export type AssertFn<TResolver extends Resolver> = <
  TSchema extends Schema<TResolver>,
>(
  schema: TSchema,
  data: unknown,
) => Promise<Output<TResolver, TSchema>>;

export function createValidate<TResolver extends Resolver>(
  adapter: ValidationAdapter<TResolver>,
): ValidateFn<TResolver> {
  return async (schema, data) => {
    const validateSchema = await adapter(schema);
    return validateSchema(data);
  };
}

export function createAssert<TResolver extends Resolver>(
  adapter: ValidationAdapter<TResolver>,
): AssertFn<TResolver> {
  const validate = createValidate<TResolver>(adapter);
  return async (schema, data) => {
    const result = await validate(schema, data);
    if (result.success) {
      return result.data;
    }
    throw new AggregateError(result.issues, 'Assertion failed');
  };
}

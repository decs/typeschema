type AssertSchema<T> = {
  assert(data: unknown): T;
};
type CheckSchema<T> = {
  check(data: unknown): T;
};
type CreateSchema<T> = {
  create(data: unknown): T;
};
type FunctionSchema<T> = {
  (data: unknown): T;
};
type ParseSchema<T> = {
  parse(data: unknown): T;
};
type ValidateSchema<T> = {
  validate(data: unknown, options: {strict: boolean}): Promise<T>;
};
type ValidateAsyncSchema<T> = {
  validateAsync(data: unknown): Promise<T>;
};

export type Schema<T> =
  | AssertSchema<T>
  | CheckSchema<T>
  | CreateSchema<T>
  | FunctionSchema<T>
  | ParseSchema<T>
  | ValidateSchema<T>
  | ValidateAsyncSchema<T>;

export type Infer<TSchema> = TSchema extends Schema<infer T> ? T : never;

export type TypeSchema<T> = {
  assert(data: unknown): Promise<T>;
};

export type TypeSchema<T> = {
  validate(
    data: unknown,
  ): Promise<
    {valid: true; value: T} | {valid: false; errors: Array<ValidationError>}
  >;
};
export class ValidationError extends Error {
  constructor(message: string, public path?: Array<string | number | symbol>) {
    super(message);
  }
}

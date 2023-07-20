export type TypeSchema<T = unknown> = {
  validate(
    data: unknown,
  ): Promise<{data: T} | {issues: Array<ValidationIssue>}>;
};

export class ValidationIssue extends Error {
  constructor(message: string, public path?: Array<string | number | symbol>) {
    super(message);
  }
}

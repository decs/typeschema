import type {InferOutput} from './registry';

export type TypeSchema<TSchema> = {
  validate(
    data: unknown,
  ): Promise<{data: InferOutput<TSchema>} | {issues: Array<ValidationIssue>}>;
};

export class ValidationIssue extends Error {
  constructor(message: string, public path?: Array<string | number | symbol>) {
    super(message);
  }
}

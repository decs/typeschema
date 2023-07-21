import type {InferSchema} from './resolver';
import type {IfDefined} from './utils';

export type Schema = {
  [K in keyof TypeSchemaRegistry]: IfDefined<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    InferSchema<TypeSchemaRegistry[K], any>
  >;
}[keyof TypeSchemaRegistry];

export const Source = Symbol.for('TypeSchema.Source');

export type TypeSchema<T = unknown> = {
  [Source]: Schema;
  validate(
    data: unknown,
  ): Promise<{data: T} | {issues: Array<ValidationIssue>}>;
};

export class ValidationIssue extends Error {
  constructor(message: string, public path?: Array<string | number | symbol>) {
    super(message);
  }
}

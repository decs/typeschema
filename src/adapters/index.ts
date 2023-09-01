import type {Infer} from '../inference';
import type {Registry} from '../registry';
import type {InferSchema, Schema} from '../resolver';
import type {ValidationIssue} from '../validation';

export type Coerce<TKey extends keyof Registry> = <
  TSchema extends Schema,
  TReturn,
>(
  adapter: (schema: InferSchema<Registry[TKey]>) => TReturn,
) => (schema: TSchema) => TReturn | undefined;

export type CreateValidate = <TSchema extends Schema>(
  schema: TSchema,
) =>
  | Promise<
      (
        data: unknown,
      ) => Promise<{data: Infer<TSchema>} | {issues: Array<ValidationIssue>}>
    >
  | undefined;

export function wrap<TSchema extends Schema, TReturn>(
  adapters: Array<(schema: TSchema) => Promise<TReturn> | undefined>,
): (schema: TSchema) => Promise<TReturn> {
  return async (schema: TSchema) => {
    const results = await Promise.all(
      adapters
        .map(adapter => adapter(schema))
        .filter(Boolean) as Array<TReturn>,
    );
    if (results.length === 0) {
      throw new Error('Missing adapters for schema: ' + schema);
    }
    if (results.length > 1) {
      throw new Error('Conflicting adapters for schema: ' + schema);
    }
    return results[0];
  };
}

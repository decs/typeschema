import type {Infer} from './api/inference';
import type {Schema, TypeSchema} from './api/schema';
import type {InferModule, InferSchema} from './resolver';

export type Adapter = <TSchema extends Schema>(
  schema: TSchema,
) => Promise<TypeSchema<Infer<TSchema>> | null>;

export const adapters: Array<Adapter> = [];

export function register<TKey extends keyof TypeSchemaRegistry>(
  coerce: <TSchema extends Schema>(
    schema: TSchema,
  ) => InferSchema<TypeSchemaRegistry[TKey], Infer<TSchema>> | null,
  wrap: <T>(
    schema: InferSchema<TypeSchemaRegistry[TKey], T>,
    module: InferModule<TypeSchemaRegistry[TKey]>,
  ) => Promise<TypeSchema<T>>,
  moduleName?: string,
) {
  adapters.push(async schema => {
    let module = null;
    if (moduleName != null) {
      try {
        module = await import(moduleName);
      } catch (_e) {
        return null;
      }
    }
    const coercedSchema = coerce(schema);
    return coercedSchema != null ? wrap(coercedSchema, module) : null;
  });
}

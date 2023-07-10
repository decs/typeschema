export interface TypeSchemaResolver<Schema = unknown> {
  type: unknown;
  /**
   * The schema type to resolve into native typescript types
   */
  schema: Schema;
  /**
   * placeholder for resolved input type from the schema
   */
  input: unknown;
  /**
   * placeholder for resolved output type from the schema
   */
  output: unknown;
  /**
   * placeholder for resolved error type from the schema
   */
  error: unknown;

  /**
   * placeholder for schema base type from the typescript type
   */
  base: unknown;
}

/**
 * Infer the input type from a schema using the type provider
 * @param SchemaResolver - The type provider to use to resolve the schema
 * @param Schema - The schema to resolve
 * @returns - the typescript input type for the provided schema
 */
export type InferInputTypeFromSchema<
  SchemaResolver extends TypeSchemaResolver,
  Schema,
> = (SchemaResolver & {
  schema: Schema;
})['input'];

/**
 * Infer the output type from a schema using the type provider
 * @param SchemaResolver - The type provider to use to resolve the schema
 * @param Schema - The schema to resolve
 * @returns - the typescript output type for the provided schema
 */
export type InferOutputTypeFromSchema<
  SchemaResolver extends TypeSchemaResolver,
  Schema,
> = (SchemaResolver & {
  schema: Schema;
})['output'];

/**
 * Error type generated when an input is not validated against a schema
 */
export type SchemaValidationError<SchemaResolver extends TypeSchemaResolver> =
  SchemaResolver['error'];

/**
 * Base type of all schemas from a type schema resolver
 */
export type SchemaBaseType<
  SchemaResolver extends TypeSchemaResolver,
  T,
> = (SchemaResolver & {type: T})['base'];

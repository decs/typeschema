import type {Infer} from '../inference';
import type {InferSchema, Resolver, Schema} from '../resolver';
import type {ValidationIssue} from '../validation';

const adapters = [
  import('./ajv'),
  import('./arktype'),
  import('./deepkit'),
  import('./function'),
  import('./io-ts'),
  import('./joi'),
  import('./ow'),
  import('./runtypes'),
  import('./superstruct'),
  import('./typebox'),
  import('./valibot'),
  import('./yup'),
  import('./zod'),
];

let registry: Array<Adapter> | null = null;

export const cachedAdapters = new Map<Schema, Adapter>();

export function resetAdapters(): void {
  registry = null;
  cachedAdapters.clear();
}

export type Adapter<TResolver extends Resolver = Resolver> = {
  init: () => Promise<TResolver['module'] | undefined>;
  module: TResolver['module'];
  guard: <TSchema extends Schema>(
    schema: TSchema,
  ) => InferSchema<TResolver, Infer<TSchema>> | undefined;
  validate: <T>(
    schema: InferSchema<TResolver, T>,
    module: TResolver['module'],
  ) => (data: unknown) => Promise<{data: T} | {issues: Array<ValidationIssue>}>;
};

export async function findAdapter<TSchema extends Schema>(
  schema: TSchema,
): Promise<Adapter> {
  if (registry == null) {
    const allAdapters = await Promise.all(adapters);
    const modules = await Promise.all(
      allAdapters.map(async ({init}) => init()),
    );
    registry = allAdapters
      .map((adapter, index) =>
        modules[index] !== undefined
          ? {...adapter, module: modules[index]}
          : undefined,
      )
      .filter(Boolean) as Array<Adapter>;
  }

  const results = registry.filter(({guard}) => guard(schema) !== undefined);
  if (results.length === 0) {
    throw new Error('Missing adapters for schema: ' + schema);
  }
  if (results.length > 1) {
    throw new Error('Conflicting adapters for schema: ' + schema);
  }

  cachedAdapters.set(schema, results[0]);
  return results[0];
}

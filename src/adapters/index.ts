import type {Infer} from '../inference';
import type {InferSchema, Schema} from '../resolver';
import type {ValidationIssue} from '../validation';

import './ajv';
import './arktype';
import './deepkit';
import './function';
import './io-ts';
import './joi';
import './ow';
import './runtypes';
import './superstruct';
import './typebox';
import './valibot';
import './yup';
import './zod';

import {memoize, memoizeWithKey} from '../utils';

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

export type Adapter<
  TKey extends keyof TypeSchemaRegistry = keyof TypeSchemaRegistry,
> = {
  init: () => Promise<TypeSchemaRegistry[TKey]['module'] | null>;
  module: TypeSchemaRegistry[TKey]['module'];
  coerce: <TSchema extends Schema>(
    schema: TSchema,
  ) => InferSchema<TypeSchemaRegistry[TKey], Infer<TSchema>> | null;
  createValidate: <T>(
    schema: InferSchema<TypeSchemaRegistry[TKey], T>,
    module: TypeSchemaRegistry[TKey]['module'],
  ) => (data: unknown) => Promise<{data: T} | {issues: Array<ValidationIssue>}>;
};

const importAdapters = memoize(async () => {
  const importedAdapters = await Promise.all(adapters);
  const modules = await Promise.all(importedAdapters.map(({init}) => init()));
  return importedAdapters
    .filter((_adapter, index) => modules[index] != null)
    .map((adapter, index) => ({
      ...adapter,
      module: modules[index],
    })) as Array<Adapter>;
});

export const findAdapter = memoizeWithKey(
  async (schema: Schema): Promise<Adapter> => {
    const importedAdapters = await importAdapters();
    const results = importedAdapters.filter(
      ({coerce}) => coerce(schema) != null,
    );
    if (results.length === 0) {
      throw new Error('Missing adapters for schema: ' + schema);
    }
    if (results.length > 1) {
      throw new Error('Conflicting adapters for schema: ' + schema);
    }
    return results[0];
  },
);

export function resetAdapters(): void {
  importAdapters.clear();
  findAdapter.clear();
}

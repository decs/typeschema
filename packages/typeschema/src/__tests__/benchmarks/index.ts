import type {Schema} from '../..';

import {add, complete, cycle, suite} from 'benny';

import {validate} from '../..';

const validData = {
  age: 18,
  email: 'john.doe@test.com',
  id: 1,
  name: 'John Doe',
};
const invalidData = {
  age: 16,
  email: 'unexpected',
  id: 2,
  name: 'John Doe',
};

export default async function benchmark<TSchema extends Schema>(
  name: string,
  schema: TSchema,
  validateDirectly: (schema: TSchema, data: unknown) => Promise<void>,
): Promise<void> {
  await suite(
    name + ' with valid data',
    add('directly', () => validateDirectly(schema, validData)),
    add('through TypeSchema', () => validate(schema, validData)),
    cycle(),
    complete(() => console.log()),
  );
  await suite(
    name + ' with invalid data',
    add('directly', () => validateDirectly(schema, invalidData)),
    add('through TypeSchema', () => validate(schema, invalidData)),
    cycle(),
    complete(() => console.log()),
  );
}

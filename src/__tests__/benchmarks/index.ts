import type {Schema} from '../..';

import {add, complete, cycle, suite} from 'benny';

import {validate} from '../..';

const data = {
  age: 18,
  email: 'john.doe@test.com',
  id: 1,
  name: 'John Doe',
};

export default function benchmark<TSchema extends Schema<typeof data>>(
  name: string,
  schema: TSchema,
  validateDirectly: (schema: TSchema, data: unknown) => Promise<void>,
): void {
  suite(
    name,
    add(name + ' directly', () => validateDirectly(schema, data)),
    add(name + ' through TypeSchema', () => validate(schema, data)),
    cycle(),
    complete(),
  );
}

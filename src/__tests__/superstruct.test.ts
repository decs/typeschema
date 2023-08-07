import type {Infer, InferIn} from '..';

import {beforeEach, describe, expect, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';
import {coerce, date, number, object, string} from 'superstruct';

import {assert, createAssert, validate} from '..';
import {resetAdapters} from '../adapters';
import {extractIssues} from './utils';

describe('superstruct', () => {
  beforeEach(() => resetAdapters());

  const schema = object({
    age: number(),
    createdAt: coerce(date(), string(), value => new Date(value)),
    email: string(),
    id: string(),
    name: string(),
    updatedAt: coerce(date(), string(), value => new Date(value)),
  });

  const data = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };
  const outputData = {
    age: 123,
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
  };
  const badData = {
    age: '123',
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(outputData);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf<unknown>();
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data: outputData});
    expect(extractIssues(await validate(schema, badData))).toStrictEqual([
      {
        message: 'At path: age -- Expected a number, but received: "123"',
        path: ['age'],
      },
    ]);
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(outputData);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('createAssert', async () => {
    const assertSchema = createAssert(schema);
    expect(await assertSchema(data)).toEqual(outputData);
    await expect(assertSchema(badData)).rejects.toThrow();
  });
});

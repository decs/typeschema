import type {Infer, InferIn} from '../index.ts';

import {beforeEach, describe, expect, jest, test} from 'node:@jest/globals';
import {expectTypeOf} from 'npm:expect-type@0.16.0';
import {email, number, object, string, transform} from 'https://deno.land/x/valibot@v0.12.0/mod.ts';

import {assert, createAssert, validate} from '../index.ts';
import {fetchModule} from '../adapters/valibot.ts';
import {extractIssues} from './utils.ts';

describe('valibot', () => {
  const schema = object({
    age: number(),
    createdAt: transform(string(), value => new Date(value)),
    email: string([email()]),
    id: string(),
    name: string(),
    updatedAt: transform(string(), value => new Date(value)),
  });
  const module = '../adapters/modules/valibot';

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

  beforeEach(() => fetchModule.clear());

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(outputData);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data: outputData});
    expect(extractIssues(await validate(schema, badData))).toStrictEqual([
      {
        message: 'Invalid type',
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

  test('peer dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, data)).rejects.toThrow();
    await expect(assert(schema, data)).rejects.toThrow();
    jest.unmock(module);
  });
});

import type {Infer, InferIn} from '../index.ts';

import {describe, expect, test} from 'node:@jest/globals';
import {expectTypeOf} from 'npm:expect-type@0.16.0';
import {z} from 'https://deno.land/x/zod@v3.21.4/mod.ts';

import {assert, createAssert, validate} from '../index.ts';
import {extractIssues} from './utils.ts';

describe('zod', () => {
  const schema = z.object({
    age: z.number(),
    createdAt: z.string().transform(value => new Date(value)),
    email: z.string().email(),
    id: z.string(),
    name: z.string(),
    updatedAt: z.string().transform(value => new Date(value)),
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
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data: outputData});
    expect(extractIssues(await validate(schema, badData))).toStrictEqual([
      {
        message: 'Expected number, received string',
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

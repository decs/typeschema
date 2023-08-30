import type {Infer, InferIn} from '../index.ts';

import * as S from 'npm:@effect/schema@0.33.2/Schema';
import {beforeEach, describe, expect, jest, test} from 'node:@jest/globals';
import {initTRPC} from 'npm:@trpc/server@10.37.1';
import {expectTypeOf} from 'npm:expect-type@0.16.0';

import {assert, validate, wrap} from '../index.ts';
import {fetchModule} from '../adapters/effect.ts';

const readonly = <A extends Record<string, unknown>>(a: A): Readonly<A> => a;

describe('effect', () => {
  const schema = S.struct({
    age: S.number,
    createdAt: S.dateFromString(S.string),
    email: S.string,
    id: S.string,
    name: S.string,
    updatedAt: S.dateFromString(S.string),
  });
  const module = '../adapters/modules/effect';

  const data = readonly({
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  });
  const outputData = readonly({
    age: 123,
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
  });
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
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [
        {
          message: `error(s) found
└─ [\"age\"]
   └─ Expected number, actual \"123\"`,
        },
      ],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(outputData);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('wrap', async () => {
    const tRPC = initTRPC.create();
    tRPC.router({
      hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
        expectTypeOf<typeof input>().toEqualTypeOf(outputData);
        return input;
      }),
    });
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

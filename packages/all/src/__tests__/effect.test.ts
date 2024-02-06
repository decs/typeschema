/**
 * This file is generated. Do not modify it manually!
 */

import type {Infer, InferIn} from '..';

import * as S from '@effect/schema/Schema';
import {describe, expect, test} from '@jest/globals';
import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';

import {assert, validate, wrap} from '..';

const readonly = <A extends Record<string, unknown>>(a: A): Readonly<A> => a;

describe('effect', () => {
  const schema = S.struct({
    age: S.number,
    createdAt: S.DateFromString,
    email: S.string,
    id: S.string,
    name: S.string,
    updatedAt: S.DateFromString,
  });

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

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(outputData);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({
      data: outputData,
      success: true,
    });
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [
        {
          message: `{ age: number; email: string; id: string; name: string; createdAt: DateFromString; updatedAt: DateFromString }
└─ [\"age\"]
   └─ Expected a number, actual \"123\"`,
        },
      ],
      success: false,
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(outputData);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('wrap', async () => {
    const tRPC = initTRPC.create();
    const router = tRPC.router({
      hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
        expectTypeOf<typeof input>().toEqualTypeOf(outputData);
        return input;
      }),
    });
    const createCaller = tRPC.createCallerFactory(router);
    const caller = createCaller({});
    expect(await caller.hello(data)).toStrictEqual(outputData);
  });
});

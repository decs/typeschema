import type {Infer, InferIn} from '..';

import {describe, expect, test} from '@jest/globals';
import {Type} from '@sinclair/typebox';
import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';

import {assert, validate, wrap} from '..';

describe('typebox', () => {
  const schema = Type.Object({
    age: Type.Number(),
    createdAt: Type.String(),
    email: Type.String(),
    id: Type.String(),
    name: Type.String(),
    updatedAt: Type.String(),
  });

  const data = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
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
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(data);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({
      data,
      success: true,
    });
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [{message: 'Expected number', path: ['/age']}],
      success: false,
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(data);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('wrap', async () => {
    const tRPC = initTRPC.create();
    const router = tRPC.router({
      hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
        expectTypeOf<typeof input>().toEqualTypeOf(data);
        return input;
      }),
    });
    const createCaller = tRPC.createCallerFactory(router);
    const caller = createCaller({});
    expect(await caller.hello(data)).toStrictEqual(data);
  });
});

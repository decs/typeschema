/**
 * This file is generated. Do not modify it manually!
 */

import type {Infer, InferIn} from '..';

import {describe, expect, test} from '@jest/globals';
import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';
import typia from 'typia';

import {assert, validate, wrap} from '..';

function assertString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Not a string');
  }
  return value;
}

async function assertStringAsync(value: unknown): Promise<string> {
  return assertString(value);
}

describe('function', () => {
  describe('sync', () => {
    const schema = assertString;

    test('infer', () => {
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
      expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf<string>();
    });

    test('validate', async () => {
      expect(await validate(schema, '123')).toStrictEqual({
        data: '123',
        success: true,
      });
      expect(await validate(schema, 123)).toStrictEqual({
        issues: [{message: 'Not a string'}],
        success: false,
      });
    });

    test('assert', async () => {
      expect(await assert(schema, '123')).toStrictEqual('123');
      await expect(assert(schema, 123)).rejects.toThrow();
    });

    test('wrap', async () => {
      const tRPC = initTRPC.create();
      const router = tRPC.router({
        hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
          expectTypeOf<typeof input>().toEqualTypeOf<string>();
          return input;
        }),
      });
      const createCaller = tRPC.createCallerFactory(router);
      const caller = createCaller({});
      expect(await caller.hello('123')).toStrictEqual('123');
    });
  });

  describe('async', () => {
    const schema = assertStringAsync;

    test('infer', () => {
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
      expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf<string>();
    });

    test('validate', async () => {
      expect(await validate(schema, '123')).toStrictEqual({
        data: '123',
        success: true,
      });
      expect(await validate(schema, 123)).toStrictEqual({
        issues: [{message: 'Not a string'}],
        success: false,
      });
    });

    test('assert', async () => {
      expect(await assert(schema, '123')).toStrictEqual('123');
      await expect(assert(schema, 123)).rejects.toThrow();
    });

    test('wrap', async () => {
      const tRPC = initTRPC.create();
      const router = tRPC.router({
        hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
          expectTypeOf<typeof input>().toEqualTypeOf<string>();
          return input;
        }),
      });
      const createCaller = tRPC.createCallerFactory(router);
      const caller = createCaller({});
      expect(await caller.hello('123')).toStrictEqual('123');
    });
  });

  describe('typia', () => {
    const schema = typia.createAssert<{
      age: number;
      createdAt: string;
      email: string;
      id: string;
      name: string;
      updatedAt: string;
    }>();

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
        issues: [
          {
            message:
              'Error on typia.assert(): invalid type on $input.age, expect to be number',
          },
        ],
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
});

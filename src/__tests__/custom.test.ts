import type {Infer, InferIn} from '..';

import {describe, expect, test} from '@jest/globals';
import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';

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

describe('custom', () => {
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
      tRPC.router({
        hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
          expectTypeOf<typeof input>().toEqualTypeOf<string>();
          return input;
        }),
      });
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
      tRPC.router({
        hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
          expectTypeOf<typeof input>().toEqualTypeOf<string>();
          return input;
        }),
      });
    });
  });
});

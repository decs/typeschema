import type {Infer, InferIn} from '../index.ts';

import {describe, expect, test} from 'node:@jest/globals';
import {expectTypeOf} from 'npm:expect-type@0.16.0';

import {assert, createAssert, validate} from '../index.ts';
import {extractIssues} from './utils.ts';

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
      expect(await validate(schema, '123')).toStrictEqual({data: '123'});
      expect(extractIssues(await validate(schema, 123))).toStrictEqual([
        {message: 'Not a string'},
      ]);
    });

    test('assert', async () => {
      expect(await assert(schema, '123')).toStrictEqual('123');
      await expect(assert(schema, 123)).rejects.toThrow();
    });
  });

  describe('async', () => {
    const schema = assertStringAsync;

    test('infer', () => {
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
      expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf<string>();
    });

    test('validate', async () => {
      expect(await validate(schema, '123')).toStrictEqual({data: '123'});
      expect(extractIssues(await validate(schema, 123))).toStrictEqual([
        {message: 'Not a string'},
      ]);
    });

    test('assert', async () => {
      expect(await assert(schema, '123')).toStrictEqual('123');
      await expect(assert(schema, 123)).rejects.toThrow();
    });

    test('createAssert', async () => {
      const assertSchema = createAssert(schema);
      expect(await assertSchema('123')).toEqual('123');
      await expect(assertSchema(123)).rejects.toThrow();
    });
  });
});

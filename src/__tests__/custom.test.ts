import type {InferInput, InferOutput} from '..';

import {describe, expect, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

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

    test('validate', async () => {
      expect(await validate(schema, '123')).toStrictEqual({data: '123'});
      expect(await validate(schema, 123)).toStrictEqual({
        issues: [new ValidationIssue('Not a string')],
      });
    });

    test('assert', async () => {
      expect(await assert(schema, '123')).toStrictEqual('123');
      await expect(assert(schema, 123)).rejects.toThrow();
    });
  });

  describe('async', () => {
    const schema = assertStringAsync;

    test('validate', async () => {
      expect(await validate(schema, '123')).toStrictEqual({data: '123'});
      expect(await validate(schema, 123)).toStrictEqual({
        issues: [new ValidationIssue('Not a string')],
      });
    });

    test('assert', async () => {
      expect(await assert(schema, '123')).toStrictEqual('123');
      await expect(assert(schema, 123)).rejects.toThrow();
    });
  });

  describe('Infer', () => {
    test('infer input', () => {
      expectTypeOf<InferInput<typeof assertString>>().toEqualTypeOf<string>();
      expectTypeOf<
        InferInput<typeof assertStringAsync>
      >().toEqualTypeOf<string>();
    });

    test('infer output', () => {
      expectTypeOf<InferOutput<typeof assertString>>().toEqualTypeOf<string>();
      expectTypeOf<
        InferOutput<typeof assertStringAsync>
      >().toEqualTypeOf<string>();
    });
  });
});

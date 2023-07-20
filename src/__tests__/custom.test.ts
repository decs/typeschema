import type {Infer} from '..';

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

    test('infer', () => {
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
    });

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

    test('infer', () => {
      expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<string>();
    });

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
});

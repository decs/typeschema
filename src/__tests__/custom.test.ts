import {describe, expect, test} from '@jest/globals';

import {assert} from '../assert';

function assertString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Not a string');
  }
  return value;
}

describe('custom', () => {
  test('assert', async () => {
    expect(await assert(assertString, '123')).toEqual('123');
    await expect(assert(assertString, 123)).rejects.toThrow();
  });
});

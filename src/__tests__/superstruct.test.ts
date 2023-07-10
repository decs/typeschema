import {describe, expect, jest, test} from '@jest/globals';
import {string} from 'superstruct';

import {assert} from '..';

describe('superstruct', () => {
  test('assert', async () => {
    expect(await assert(string(), '123')).toEqual('123');
    await expect(assert(string(), 123)).rejects.toThrow();
    jest.mock('superstruct', () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(string(), '123')).rejects.toThrow();
  });
});

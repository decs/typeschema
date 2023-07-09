import {describe, expect, test} from '@jest/globals';
import {string} from 'superstruct';

import {assert} from '..';

describe('superstruct', () => {
  test('assert', async () => {
    expect(await assert(string(), '123')).toEqual('123');
    await expect(assert(string(), 123)).rejects.toThrow();
  });
});

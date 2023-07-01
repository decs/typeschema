import {describe, expect, test} from '@jest/globals';
import {z} from 'zod';

import {assert} from '../assert';

describe('zod', () => {
  test('assert', async () => {
    expect(await assert(z.string(), '123')).toEqual('123');
    await expect(assert(z.string(), 123)).rejects.toThrow();
  });
});

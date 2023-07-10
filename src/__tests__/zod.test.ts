import {describe, expect, jest, test} from '@jest/globals';
import {z} from 'zod';

import {assert} from '..';

describe('zod', () => {
  test('assert', async () => {
    expect(await assert(z.string(), '123')).toEqual('123');
    await expect(assert(z.string(), 123)).rejects.toThrow();
    jest.mock('zod', () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(z.string(), '123')).rejects.toThrow();
  });
});

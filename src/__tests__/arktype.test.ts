import {describe, expect, jest, test} from '@jest/globals';
import {type} from 'arktype';

import {assert} from '..';

describe('arktype', () => {
  test('assert', async () => {
    expect(await assert(type('string'), '123')).toEqual('123');
    await expect(assert(type('string'), 123)).rejects.toThrow();
    jest.mock('arktype', () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(type('string'), '123')).rejects.toThrow();
  });
});

import {describe, expect, jest, test} from '@jest/globals';
import {String} from 'runtypes';

import {assert} from '..';

describe('runtypes', () => {
  test('assert', async () => {
    expect(await assert(String, '123')).toEqual('123');
    await expect(assert(String, 123)).rejects.toThrow();
    jest.mock('runtypes', () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(String, '123')).rejects.toThrow();
  });
});

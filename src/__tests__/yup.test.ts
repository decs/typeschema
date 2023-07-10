import {describe, expect, jest, test} from '@jest/globals';
import {string} from 'yup';

import {assert} from '..';

describe('yup', () => {
  test('assert', async () => {
    expect(await assert(string(), '123')).toEqual('123');
    await expect(assert(string(), 123)).rejects.toThrow();
    jest.mock('yup', () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(string(), '123')).rejects.toThrow();
  });
});

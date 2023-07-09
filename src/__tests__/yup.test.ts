import {describe, expect, test} from '@jest/globals';
import {string} from 'yup';

import {assert} from '..';

describe('yup', () => {
  test('assert', async () => {
    expect(await assert(string(), '123')).toEqual('123');
    await expect(assert(string(), 123)).rejects.toThrow();
  });
});

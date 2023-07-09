import {describe, expect, test} from '@jest/globals';
import {String} from 'runtypes';

import {assert} from '..';

describe('runtypes', () => {
  test('assert', async () => {
    expect(await assert(String, '123')).toEqual('123');
    await expect(assert(String, 123)).rejects.toThrow();
  });
});

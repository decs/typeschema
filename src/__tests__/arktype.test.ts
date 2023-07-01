import {describe, expect, test} from '@jest/globals';
import {type} from 'arktype';

import {assert} from '../assert';

describe('arktype', () => {
  test('assert', async () => {
    expect(await assert(type('string'), '123')).toEqual('123');
    await expect(assert(type('string'), 123)).rejects.toThrow();
  });
});

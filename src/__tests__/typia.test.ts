import {describe, expect, test} from '@jest/globals';
import typia from 'typia';

import {assert} from '../assert';

describe('typia', () => {
  test('assert', async () => {
    expect(await assert(typia.createAssert<string>(), '123')).toEqual('123');
    await expect(assert(typia.createAssert<string>(), 123)).rejects.toThrow();
  });
});

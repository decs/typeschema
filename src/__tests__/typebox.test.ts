import {describe, expect, test} from '@jest/globals';
import {Type} from '@sinclair/typebox';

import {assert} from '..';

describe('typebox', () => {
  test('assert', async () => {
    expect(await assert(Type.String(), '123')).toEqual('123');
    await expect(assert(Type.String(), 123)).rejects.toThrow();
  });
});

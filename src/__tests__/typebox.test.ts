import {describe, expect, jest, test} from '@jest/globals';
import {Type} from '@sinclair/typebox';

import {assert} from '..';

describe('typebox', () => {
  test('assert', async () => {
    expect(await assert(Type.String(), '123')).toEqual('123');
    await expect(assert(Type.String(), 123)).rejects.toThrow();
    jest.mock('@sinclair/typebox', () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(Type.String(), '123')).rejects.toThrow();
  });
});

import {describe, expect, jest, test} from '@jest/globals';
import {string} from 'superstruct';

import {assert, clearCache, validate} from '..';
import {ValidationIssue} from '../schema';

describe('superstruct', () => {
  const schema = string();
  const module = 'superstruct';

  test('validate', async () => {
    expect(await validate(schema, '123')).toStrictEqual({data: '123'});
    expect(await validate(schema, 123)).toStrictEqual({
      issues: [new ValidationIssue('Expected a string, but received: 123')],
    });
    clearCache();
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });

  test('assert', async () => {
    expect(await assert(schema, '123')).toStrictEqual('123');
    await expect(assert(schema, 123)).rejects.toThrow();
    clearCache();
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });
});

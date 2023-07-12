import {describe, expect, jest, test} from '@jest/globals';
import {Type} from '@sinclair/typebox';

import {assert, clearCache, validate} from '..';
import {ValidationIssue} from '../schema';

describe('typebox', () => {
  const schema = Type.String();
  const module = '@sinclair/typebox';

  test('validate', async () => {
    expect(await validate(schema, '123')).toStrictEqual({data: '123'});
    expect(await validate(schema, 123)).toStrictEqual({
      issues: [new ValidationIssue('Expected string')],
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

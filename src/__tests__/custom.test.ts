import {describe, expect, test} from '@jest/globals';

import {assert, validate} from '..';
import {ValidationError} from '../schema';

function assertString(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Not a string');
  }
  return value;
}

describe('custom', () => {
  const schema = assertString;

  test('validate', async () => {
    expect(await validate(schema, '123')).toStrictEqual({
      valid: true,
      value: '123',
    });
    expect(await validate(schema, 123)).toStrictEqual({
      errors: [new ValidationError('Not a string')],
      valid: false,
    });
  });

  test('assert', async () => {
    expect(await assert(schema, '123')).toStrictEqual('123');
    await expect(assert(schema, 123)).rejects.toThrow();
  });
});

import {describe, expect, jest, test} from '@jest/globals';
import {string} from 'yup';

import {assert, validate} from '..';
import {ValidationError} from '../schema';

describe('yup', () => {
  const schema = string();
  const module = 'yup';

  test('validate', async () => {
    expect(await validate(schema, '123')).toStrictEqual({
      valid: true,
      value: '123',
    });
    expect(await validate(schema, 123)).toStrictEqual({
      errors: [
        new ValidationError(
          'this must be a `string` type, but the final value was: `123`.',
        ),
      ],
      valid: false,
    });
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });

  test('assert', async () => {
    expect(await assert(schema, '123')).toStrictEqual('123');
    await expect(assert(schema, 123)).rejects.toThrow();
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });
});

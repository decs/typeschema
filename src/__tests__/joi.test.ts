import {describe, expect, test} from '@jest/globals';
import Joi from 'joi';

import {assert} from '..';

describe('joi', () => {
  test('assert', async () => {
    expect(await assert(Joi.string(), '123')).toEqual('123');
    await expect(assert(Joi.string(), 123)).rejects.toThrow();
  });
});

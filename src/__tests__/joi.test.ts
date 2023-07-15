import type {InferInput, InferOutput} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';
import Joi from 'joi';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('joi', () => {
  const schema = Joi.object({
    age: Joi.number().required(),
    createdAt: Joi.date().required(),
    email: Joi.string().email().required(),
    id: Joi.string().required(),
    name: Joi.string().required(),
    updatedAt: Joi.date().required(),
  });
  const module = 'joi';
  const data = {
    age: 123,
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    email: 'john.doe@test.com',
    id: '123',
    name: 'John Doe',
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
  };
  const badData = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe',
    id: '123',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };

  test('peer dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, data)).rejects.toThrow();
    await expect(assert(schema, data)).rejects.toThrow();

    jest.unmock(module);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [new ValidationIssue('"email" must be a valid email')],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(data);
    await expect(assert(schema, 123)).rejects.toThrow();
  });

  // eslint-disable-next-line jest/no-disabled-tests -- joi is not really typesafe, re-enable when it is
  test.skip('infer input', () => {
    // @ts-expect-error - joi does not support inferring objects yet
    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<typeof data>();
  });

  // eslint-disable-next-line jest/no-disabled-tests -- joi is not really typesafe, re-enable when it is
  test.skip('infer output', () => {
    // @ts-expect-error - joi does not support inferring objects yet
    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<typeof data>();
  });
});

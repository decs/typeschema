import type {Infer, InferIn} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';
import Joi from 'joi';

import {assert, createAssert, validate} from '..';
import {extractIssues} from './utils';

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

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<unknown>();
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf<unknown>();
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data});
    expect(extractIssues(await validate(schema, badData))).toStrictEqual([
      {
        message: '"email" must be a valid email',
        path: ['email'],
      },
    ]);
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(data);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('createAssert', async () => {
    const assertSchema = createAssert(schema);
    expect(await assertSchema(data)).toEqual(data);
    await expect(assertSchema(badData)).rejects.toThrow();
  });
});

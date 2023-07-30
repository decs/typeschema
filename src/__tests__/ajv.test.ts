import type {Infer, InferIn} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';

import {assert, createAssert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('ajv', () => {
  const schema = {
    additionalProperties: false,
    properties: {
      age: {type: 'integer'},
      createdAt: {type: 'string'},
      email: {type: 'string'},
      id: {type: 'string'},
      name: {type: 'string'},
      updatedAt: {type: 'string'},
    },
    required: ['age', 'createdAt', 'email', 'id', 'name', 'updatedAt'],
    type: 'object',
  };
  const module = 'ajv';

  const data = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };
  const badData = {
    age: '123',
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
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

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('infer', () => {
    // @ts-expect-error Ajv doesn't support inferring types yet
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(data);
    // @ts-expect-error Ajv doesn't support inferring types yet
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [new ValidationIssue('must be integer')],
    });
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

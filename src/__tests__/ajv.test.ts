import type {Infer, InferIn} from '..';

import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';

import {assert, validate, wrap} from '..';
import {fetchModule} from '../adapters/ajv';

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
  const module = '../adapters/modules/ajv';

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

  beforeEach(() => fetchModule.clear());

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<unknown>();
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf<unknown>();
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [{message: 'must be integer', path: ['#/properties/age/type']}],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(data);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('wrap', async () => {
    const tRPC = initTRPC.create();
    tRPC.router({
      hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
        expectTypeOf<typeof input>().toEqualTypeOf<unknown>();
        return input;
      }),
    });
  });

  test('peer dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, data)).rejects.toThrow();
    await expect(assert(schema, data)).rejects.toThrow();
    jest.unmock(module);
  });
});

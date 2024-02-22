/**
 * This file is generated. Do not modify it manually!
 */

import type {Infer, InferIn} from '..';

import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';
import {describe, expect, test} from 'vitest';
import {date, number, object, string} from 'yup';

import {assert, toJSONSchema, validate, wrap} from '..';

describe('yup', () => {
  const schema = object({
    age: number().required(),
    createdAt: date().required(),
    email: string().required(),
    id: string().required(),
    name: string().required(),
    updatedAt: date().required(),
  });

  const data = {
    age: 123,
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
  };
  const badData = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(data);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({
      data,
      success: true,
    });
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [
        {
          message:
            'updatedAt must be a `date` type, but the final value was: `"2021-01-01T00:00:00.000Z"`.',
          path: ['updatedAt'],
        },
      ],
      success: false,
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(data);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('wrap', async () => {
    const tRPC = initTRPC.create();
    const router = tRPC.router({
      hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
        expectTypeOf<typeof input>().toEqualTypeOf(data);
        return input;
      }),
    });
    const createCaller = tRPC.createCallerFactory(router);
    const caller = createCaller({});
    expect(await caller.hello(data)).toStrictEqual(data);
  });

  test('toJSONSchema', async () => {
    expect(await toJSONSchema(schema)).toStrictEqual({
      default: {
        age: undefined,
        createdAt: undefined,
        email: undefined,
        id: undefined,
        name: undefined,
        updatedAt: undefined,
      },
      properties: {
        age: {type: 'number'},
        createdAt: {format: 'date-time', type: 'string'},
        email: {type: 'string'},
        id: {type: 'string'},
        name: {type: 'string'},
        updatedAt: {format: 'date-time', type: 'string'},
      },
      required: ['age', 'createdAt', 'email', 'id', 'name', 'updatedAt'],
      type: 'object',
    });
  });
});

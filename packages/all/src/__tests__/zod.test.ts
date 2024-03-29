/**
 * This file is generated. Do not modify it manually!
 */

import type {Infer, InferIn} from '..';

import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';
import {describe, expect, test} from 'vitest';
import {z} from 'zod';

import {assert, toJSONSchema, validate, wrap} from '..';

describe('zod', () => {
  const schema = z.object({
    age: z.number(),
    createdAt: z.string().transform(value => new Date(value)),
    email: z.string().email(),
    id: z.string(),
    name: z.string(),
    updatedAt: z.string().transform(value => new Date(value)),
  });

  const data = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };
  const outputData = {
    age: 123,
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
  };
  const badData = {
    age: '123',
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(outputData);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({
      data: outputData,
      success: true,
    });
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [{message: 'Expected number, received string', path: ['age']}],
      success: false,
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(outputData);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('wrap', async () => {
    const tRPC = initTRPC.create();
    const router = tRPC.router({
      hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
        expectTypeOf<typeof input>().toEqualTypeOf(outputData);
        return input;
      }),
    });
    const createCaller = tRPC.createCallerFactory(router);
    const caller = createCaller({});
    expect(await caller.hello(data)).toStrictEqual(outputData);
  });

  test('toJSONSchema', async () => {
    expect(await toJSONSchema(schema)).toStrictEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      additionalProperties: false,
      properties: {
        age: {type: 'number'},
        createdAt: {type: 'string'},
        email: {format: 'email', type: 'string'},
        id: {type: 'string'},
        name: {type: 'string'},
        updatedAt: {type: 'string'},
      },
      required: ['age', 'createdAt', 'email', 'id', 'name', 'updatedAt'],
      type: 'object',
    });
  });
});

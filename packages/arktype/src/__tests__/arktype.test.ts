import type {Infer, InferIn} from '..';

import {initTRPC} from '@trpc/server';
import {type} from 'arktype';
import {expectTypeOf} from 'expect-type';
import {describe, expect, test} from 'vitest';

import {assert, validate, wrap} from '..';

describe('arktype', () => {
  const schema = type({
    age: type('number').pipe((age: number) => `${age} years old`),
    createdAt: type('string').pipe((createdAt: string) => new Date(createdAt)),
    email: 'string.email',
    id: 'string.uuid',
    name: 'string',
    updatedAt: type('string').pipe((updatedAt: string) => new Date(updatedAt)),
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
    age: '123 years old',
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
  };

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(outputData);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toEqual({
      data: outputData,
      success: true,
    });
    expect(await validate(schema, outputData)).toEqual({
      issues: [
        {
          message: 'age must be a number (was a string)',
          path: ['age'],
        },
        {
          message: 'createdAt must be a string (was an object)',
          path: ['createdAt'],
        },
        {
          message: 'updatedAt must be a string (was an object)',
          path: ['updatedAt'],
        },
      ],
      success: false,
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toEqual(outputData);
    await expect(assert(schema, outputData)).rejects.toThrow();
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
});

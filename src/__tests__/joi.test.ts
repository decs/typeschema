import type {Infer, InferIn} from '..';

import {describe, expect, test} from '@jest/globals';
import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';
import Joi from 'joi';

import {assert, validate, wrap} from '..';

describe('joi', () => {
  const schema = Joi.object({
    age: Joi.number().required(),
    createdAt: Joi.date().required(),
    email: Joi.string().email().required(),
    id: Joi.string().required(),
    name: Joi.string().required(),
    updatedAt: Joi.date().required(),
  });

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

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<unknown>();
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf<unknown>();
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [{message: '"email" must be a valid email', path: ['email']}],
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
});

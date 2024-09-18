import type {Infer, InferIn} from '..';

import {initTRPC} from '@trpc/server';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import {expectTypeOf} from 'expect-type';
import {describe, expect, test} from 'vitest';

import {assert, validate, wrap} from '..';

describe('class-validator', () => {
  class NestedSchema {
    @IsString()
    @IsNotEmpty()
    value!: string;
  }

  class Schema {
    @IsInt()
    @Min(0)
    age!: number;

    @IsDateString()
    createdAt!: string;

    @IsEmail()
    email!: string;

    @IsUUID()
    id!: string;

    @IsNotEmpty()
    name!: string;

    @IsDateString()
    updatedAt!: string;

    @ValidateNested()
    nested!: NestedSchema;
    @IsOptional()
    @ValidateNested()
    nestedArray?: NestedSchema[];
  }
  const schema = Schema;

  const data = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  } as Schema;

  const badData = {
    age: '123',
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z'
  };

  const badNestedData = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
    nested: new NestedSchema(),
    nestedArray: [new NestedSchema()],
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
          message: 'age must not be less than 0',
          path: ['age'],
        },
        {
          message: 'age must be an integer number',
          path: ['age'],
        }
      ],
      success: false,
    });

    expect(await validate(schema, badNestedData)).toStrictEqual({
      issues: [
        {
          message: 'value should not be empty',
          path: ['nested.value'],
        },
        {
          message: 'value must be a string',
          path: ['nested.value'],
        },
        {
          message: 'value should not be empty',
          path: ['nestedArray[0].value'],
        },
        {
          message: 'value must be a string',
          path: ['nestedArray[0].value'],
        }
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
});

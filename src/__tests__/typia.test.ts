import type {InferInput, InferOutput} from '..';

import {describe, expect, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';
import typia from 'typia';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('typia', () => {
  const schema = typia.createAssert<{
    age: number;
    createdAt: string;
    email: string;
    id: string;
    name: string;
    updatedAt: string;
  }>();
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

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [
        new ValidationIssue(
          'Error on typia.assert(): invalid type on $input.age, expect to be number',
        ),
      ],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(data);
    await expect(assert(schema, badData)).rejects.toThrow();
  });
  test('infer input', () => {
    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<typeof data>();
  });

  test('infer output', () => {
    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<typeof data>();
  });
});

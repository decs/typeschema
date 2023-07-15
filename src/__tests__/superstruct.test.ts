import type {InferInput, InferOutput} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';
import * as S from 'superstruct';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('superstruct', () => {
  const schema = S.object({
    age: S.number(),
    createdAt: S.coerce(S.date(), S.string(), value => new Date(value)),
    email: S.string(),
    id: S.string(),
    name: S.string(),
    updatedAt: S.coerce(S.date(), S.string(), value => new Date(value)),
  });
  const module = 'superstruct';
  const data = {
    age: 123,
    createdAt: '2021-01-01T00:00:00.000Z',
    email: 'john.doe@test.com',
    id: 'c4a760a8-dbcf-4e14-9f39-645a8e933d74',
    name: 'John Doe',
    updatedAt: '2021-01-01T00:00:00.000Z',
  };
  const dataOutput = {
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

  test('peer dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, data)).rejects.toThrow();
    await expect(assert(schema, data)).rejects.toThrow();
    jest.unmock(module);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data: dataOutput});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [
        new ValidationIssue(
          'At path: age -- Expected a number, but received: "123"',
        ),
      ],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(dataOutput);
    await expect(assert(schema, badData)).rejects.toThrow();
  });
  test('infer input', () => {
    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<
      typeof dataOutput
    >();
  });

  test('infer output', () => {
    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<
      typeof dataOutput
    >();
  });
});

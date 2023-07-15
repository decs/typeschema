import type {InferInput, InferOutput} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {Type} from '@sinclair/typebox';
import {expectTypeOf} from 'expect-type';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('typebox', () => {
  const schema = Type.Object({
    age: Type.Number(),
    createdAt: Type.String(),
    email: Type.String(),
    id: Type.String(),
    name: Type.String(),
    updatedAt: Type.String(),
  });
  const module = '@sinclair/typebox';
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

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [new ValidationIssue('Expected number')],
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

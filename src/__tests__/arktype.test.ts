import type {InferInput, InferOutput} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {type} from 'arktype';
import {expectTypeOf} from 'expect-type';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('arktype', () => {
  const schema = type({
    age: ['number', '|>', (age: number) => `${age} years old`],
    createdAt: ['string', '|>', (createdAt: string) => new Date(createdAt)],
    email: 'email',
    id: 'uuid',
    name: 'string',
    updatedAt: ['string', '|>', (updatedAt: string) => new Date(updatedAt)],
  });
  const module = 'arktype';

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

  test('peer dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, '123')).rejects.toThrow();
    await expect(assert(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });

  test('validate', async () => {
    expect(await validate(schema, structuredClone(data))).toEqual({
      data: outputData,
    });
    expect(await validate(schema, outputData)).toStrictEqual({
      issues: [
        new ValidationIssue('age must be a number (was string)'),
        new ValidationIssue('createdAt must be a string (was object)'),
        new ValidationIssue('updatedAt must be a string (was object)'),
      ],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, structuredClone(data))).toEqual(outputData);
    await expect(assert(schema, outputData)).rejects.toThrow();
  });

  test('infer input', () => {
    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<typeof data>();
  });

  test('infer output', () => {
    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<
      typeof outputData
    >();
  });
});

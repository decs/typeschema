import type {Infer, InferIn} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {type} from 'arktype';
import {expectTypeOf} from 'expect-type';

import {assert, createAssert, validate, ValidationIssue} from '..';

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
    await expect(validate(schema, structuredClone(data))).rejects.toThrow();
    await expect(assert(schema, structuredClone(data))).rejects.toThrow();
    jest.unmock(module);
  });

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(outputData);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, structuredClone(data))).toEqual({
      data: outputData,
    });
    expect(await validate(schema, structuredClone(outputData))).toStrictEqual({
      issues: [
        new ValidationIssue('age must be a number (was string)'),
        new ValidationIssue('createdAt must be a string (was object)'),
        new ValidationIssue('updatedAt must be a string (was object)'),
      ],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, structuredClone(data))).toEqual(outputData);
    await expect(assert(schema, structuredClone(outputData))).rejects.toThrow();
  });

  test('createAssert', async () => {
    const assertSchema = createAssert(schema);
    expect(await assertSchema(structuredClone(data))).toEqual(outputData);
    await expect(assertSchema(structuredClone(outputData))).rejects.toThrow();
  });
});

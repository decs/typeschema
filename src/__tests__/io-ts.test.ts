import type {InferInput, InferOutput} from '..';

import {describe, expect, jest, test} from '@jest/globals';
import {expectTypeOf} from 'expect-type';
import * as t from 'io-ts';
import {DateFromISOString} from 'io-ts-types';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('io-ts', () => {
  const schema = t.type({
    age: t.number,
    createdAt: DateFromISOString,
    email: t.string,
    id: t.string,
    name: t.string,
    updatedAt: DateFromISOString,
  });
  const module = 'io-ts';
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

  test('peer dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, data)).rejects.toThrow();
    await expect(assert(schema, data)).rejects.toThrow();
    jest.unmock(module);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data: outputData});
    expect(await validate(schema, outputData)).toStrictEqual({
      issues: [new ValidationIssue(''), new ValidationIssue('')],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(outputData);
    await expect(assert(schema, outputData)).rejects.toThrow();
  });

  test('inferInput', () => {
    expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<{
      email: string;
      age: number;
      createdAt: string;
      id: string;
      name: string;
      updatedAt: string;
    }>();
  });

  test('inferOutput', () => {
    expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<{
      email: string;
      age: number;
      createdAt: Date;
      id: string;
      name: string;
      updatedAt: Date;
    }>();
  });
});

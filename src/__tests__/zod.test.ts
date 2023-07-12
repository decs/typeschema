import {describe, expect, jest, test} from '@jest/globals';
import {z} from 'zod';

import {assert, setCaching, validate} from '..';
import {ValidationIssue} from '../schema';

describe('zod', () => {
  const schema = z.string();
  const module = 'zod';

  test('do not validate with no zod dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });

  test('do not assert with no zod dependency', async () => {
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });

  test('validate', async () => {
    expect(await validate(schema, '123')).toStrictEqual({data: '123'});
    expect(await validate(schema, 123)).toStrictEqual({
      issues: [new ValidationIssue('Expected string, received number')],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, '123')).toStrictEqual('123');
    await expect(assert(schema, 123)).rejects.toThrow();
  });

  test('performance', async () => {
    const userSchema = z.object({
      age: z.number().min(18),
      email: z.string().email(),
      id: z.number(),
      name: z.string(),
    });
    const data = {
      age: 18,
      email: 'john.doe@test.com',
      id: 1,
      name: 'John Doe',
    };
    const iterations = 100000;
    // with cache
    setCaching(true);
    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
      await validate(userSchema, data);
    }
    const end = Date.now();
    const cachedDuration = end - start;
    // caching disabled
    setCaching(false);
    const start2 = Date.now();
    for (let i = 0; i < iterations; i++) {
      await validate(userSchema, data);
    }
    const end2 = Date.now();
    const noCacheDuration = end2 - start2;
    expect(cachedDuration).toBeLessThan(noCacheDuration);
  }, 10000);
});

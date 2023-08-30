import type {Infer, InferIn} from '..';

import * as S from '@effect/schema/Schema';
import {describe, expect, test} from '@jest/globals';
import {initTRPC} from '@trpc/server';
import {expectTypeOf} from 'expect-type';

import {assert, validate, wrap} from '..';

const readonly = <A extends Record<string, any>>(a:A):  Readonly<A> => a

describe('effect', () => {
  const schema = S.struct({
    age: S.number,
    id: S.NumberFromString,
    name: S.string,
  });

  const data = readonly({
    age: 123,
    id: '1',
    name: 'John Doe',
  });

  const outputData = readonly({
    age: 123,
    id:1,
    name: 'John Doe',
  });

  const badData = {
    age: '123',
    id: '1',
    name: 'John Doe',
  };

  test('infer', () => {
    expectTypeOf<Infer<typeof schema>>().toEqualTypeOf(outputData);
    expectTypeOf<InferIn<typeof schema>>().toEqualTypeOf(data);
  });

  test('validate', async () => {
    expect(await validate(schema, data)).toStrictEqual({data: outputData});
    expect(await validate(schema, badData)).toStrictEqual({
      issues: [{message: 'Expected number, received string'}],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, data)).toStrictEqual(outputData);
    await expect(assert(schema, badData)).rejects.toThrow();
  });

  test('wrap', async () => {
    const tRPC = initTRPC.create();
    tRPC.router({
      hello: tRPC.procedure.input(wrap(schema)).query(({input}) => {
        expectTypeOf<typeof input>().toEqualTypeOf(outputData);
        return input;
      }),
    });
  });
});
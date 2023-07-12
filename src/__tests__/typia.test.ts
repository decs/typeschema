import {describe, expect, test} from '@jest/globals';
import typia from 'typia';

import {assert, validate} from '..';
import {ValidationIssue} from '../schema';

describe('typia', () => {
  const schema = typia.createAssert<string>();

  test('validate', async () => {
    expect(await validate(schema, '123')).toStrictEqual({data: '123'});
    expect(await validate(schema, 123)).toStrictEqual({
      issues: [
        new ValidationIssue(
          'Error on typia.assert(): invalid type on $input, expect to be string',
        ),
      ],
    });
  });

  test('assert', async () => {
    expect(await assert(schema, '123')).toStrictEqual('123');
    await expect(assert(schema, 123)).rejects.toThrow();
  });
});

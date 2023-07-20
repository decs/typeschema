import {Type} from '@sinclair/typebox';
import {Value} from '@sinclair/typebox/value';

import benchmark from '.';

benchmark(
  'typebox',
  Type.Object({
    age: Type.Number(),
    email: Type.String(),
    id: Type.Number(),
    name: Type.String(),
  }),
  async (schema, data) => {
    Value.Check(schema, data);
  },
);

import {Type} from 'npm:@sinclair/typebox@0.31.17';
import {Value} from 'npm:@sinclair/typebox@0.31.17/value';

import benchmark from './index.ts';

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
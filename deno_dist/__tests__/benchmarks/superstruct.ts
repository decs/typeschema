import {number, object, string} from 'npm:superstruct@1.0.3';

import benchmark from './index.ts';

benchmark(
  'superstruct',
  object({
    age: number(),
    email: string(),
    id: number(),
    name: string(),
  }),
  async (schema, data) => {
    schema.validate(data, {coerce: true});
  },
);

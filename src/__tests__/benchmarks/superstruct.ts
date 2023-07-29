import {number, object, string} from 'superstruct';

import benchmark from '.';

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

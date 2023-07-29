import * as t from 'io-ts';

import benchmark from '.';

benchmark(
  'io-ts',
  t.type({
    age: t.number,
    email: t.string,
    id: t.number,
    name: t.string,
  }),
  async (schema, data) => {
    schema.decode(data);
  },
);

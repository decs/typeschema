import * as t from 'npm:io-ts@2.2.20';

import benchmark from './index.ts';

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

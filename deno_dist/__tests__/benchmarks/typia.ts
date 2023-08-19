import typia from 'npm:typia@4.2.1';

import benchmark from './index.ts';

benchmark(
  'typia',
  typia.createAssert<{
    age: number;
    email: string;
    id: number;
    name: string;
  }>(),
  async (schema, data) => {
    schema(data);
  },
);

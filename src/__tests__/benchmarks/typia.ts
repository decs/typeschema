import typia from 'typia';

import benchmark from '.';

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

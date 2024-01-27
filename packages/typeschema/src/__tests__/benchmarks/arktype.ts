import {type} from 'arktype';

import benchmark from '.';

benchmark(
  'arktype',
  type({
    age: 'number>=18',
    email: 'email',
    id: 'number',
    name: 'string',
  }),
  async (schema, data) => {
    schema(data);
  },
);

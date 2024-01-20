import {type} from 'npm:arktype@1.0.29-alpha';

import benchmark from './index.ts';

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

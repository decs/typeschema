import {Number, Record, String} from 'npm:runtypes@6.7.0';

import benchmark from './index.ts';

benchmark(
  'runtypes',
  Record({
    age: Number,
    email: String,
    id: Number,
    name: String,
  }),
  async (schema, data) => {
    schema.validate(data);
  },
);

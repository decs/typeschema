import {Number, Record, String} from 'runtypes';

import benchmark from '.';

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

import ow from 'npm:ow@0.28.2';

import benchmark from './index.ts';

benchmark(
  'ow',
  ow.object.exactShape({
    age: ow.number,
    email: ow.string,
    id: ow.number,
    name: ow.string,
  }),
  async (schema, data) => {
    ow(data, schema);
  },
);

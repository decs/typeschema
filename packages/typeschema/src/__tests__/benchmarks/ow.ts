import ow from 'ow';

import benchmark from '.';

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

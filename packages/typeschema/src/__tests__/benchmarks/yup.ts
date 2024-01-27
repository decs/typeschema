import {number, object, string} from 'yup';

import benchmark from '.';

benchmark(
  'yup',
  object({
    age: number().required(),
    email: string().required(),
    id: number().required(),
    name: string().required(),
  }),
  async (schema, data) => {
    await schema.validate(data, {strict: true});
  },
);

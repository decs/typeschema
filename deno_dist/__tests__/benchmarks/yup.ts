import {number, object, string} from 'npm:yup@1.2.0';

import benchmark from './index.ts';

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

import Joi from 'npm:joi@17.10.2';

import benchmark from './index.ts';

benchmark(
  'joi',
  Joi.object({
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    id: Joi.number().required(),
    name: Joi.string().required(),
  }),
  async (schema, data) => {
    schema.validate(data);
  },
);
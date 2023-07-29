import Joi from 'joi';

import benchmark from '.';

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

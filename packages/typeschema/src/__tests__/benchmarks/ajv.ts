import Ajv from 'ajv';

import benchmark from '.';

const ajv = new Ajv();

benchmark(
  'ajv',
  {
    additionalProperties: false,
    properties: {
      age: {minimum: 18, type: 'integer'},
      email: {type: 'string'},
      id: {type: 'number'},
      name: {type: 'string'},
    },
    required: ['age', 'email', 'id', 'name'],
    type: 'object',
  },
  async (schema, data) => {
    ajv.validate(schema, data);
  },
);

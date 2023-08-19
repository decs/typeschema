import Ajv from 'npm:ajv@8.12.0';

import benchmark from './index.ts';

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

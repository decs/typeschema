import type {Minimum} from 'npm:@deepkit/type@1.0.1-alpha.113';

import {typeOf, validate} from 'npm:@deepkit/type@1.0.1-alpha.113';

import benchmark from './index.ts';

benchmark(
  'deepkit',
  typeOf<{
    age: number & Minimum<18>;
    email: string;
    id: number;
    name: string;
  }>(),
  async (schema, data) => {
    validate(data, schema);
  },
);

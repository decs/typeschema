import type {Minimum} from '@deepkit/type';

import {typeOf, validate} from '@deepkit/type';

import benchmark from '.';

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

import * as S from 'npm:@effect/schema@0.36.1/Schema';

import benchmark from './index.ts';

benchmark(
  'effect',
  S.struct({
    age: S.number,
    email: S.string,
    id: S.number,
    name: S.string,
  }),
  async (schema, data) => {
    S.parseEither(schema)(data);
  },
);
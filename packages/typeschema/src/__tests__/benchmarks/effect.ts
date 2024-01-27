import * as S from '@effect/schema/Schema';

import benchmark from '.';

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

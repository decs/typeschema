import {email, minValue, number, object, safeParseAsync, string} from 'valibot';

import benchmark from '.';

benchmark(
  'valibot',
  object({
    age: number([minValue(18)]),
    email: string([email()]),
    id: number(),
    name: string(),
  }),
  async (schema, data) => {
    await safeParseAsync(schema, data);
  },
);

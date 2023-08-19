import {email, minValue, number, object, safeParseAsync, string} from 'https://deno.land/x/valibot@v0.12.0/mod.ts';

import benchmark from './index.ts';

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

import {z} from 'https://deno.land/x/zod@v3.22.2/mod.ts';

import benchmark from './index.ts';

benchmark(
  'zod',
  z.object({
    age: z.number().min(18),
    email: z.string().email(),
    id: z.number(),
    name: z.string(),
  }),
  async (schema, data) => {
    await schema.safeParseAsync(data);
  },
);

import {z} from 'zod';

import benchmark from '.';

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

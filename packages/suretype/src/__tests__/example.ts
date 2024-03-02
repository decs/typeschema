import {initTRPC} from '@trpc/server';
import {v} from 'suretype';

import {wrap} from '..';

const schema = v.object({
  name: v.string().required(),
});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

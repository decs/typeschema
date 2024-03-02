import * as v from '@badrap/valita';
import {initTRPC} from '@trpc/server';

import {wrap} from '..';

const schema = v.object({name: v.string()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

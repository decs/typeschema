import {initTRPC} from '@trpc/server';
import {object, string} from 'valibot';

import {wrap} from '..';

const schema = object({name: string()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

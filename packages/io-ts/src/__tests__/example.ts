import {initTRPC} from '@trpc/server';
import * as ioTs from 'io-ts';

import {wrap} from '..';

const schema = ioTs.type({name: ioTs.string});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

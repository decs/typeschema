import {initTRPC} from '@trpc/server';
import {Record, String} from 'runtypes';

import {wrap} from '..';

const schema = Record({name: String});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

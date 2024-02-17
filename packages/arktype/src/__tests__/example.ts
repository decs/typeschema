import {initTRPC} from '@trpc/server';
import {type} from 'arktype';

import {wrap} from '..';

const schema = type({name: 'string'});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

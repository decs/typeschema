import {initTRPC} from '@trpc/server';
import typia from 'typia';

import {wrap} from '..';

const schema = typia.createAssert<{name: string}>();

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

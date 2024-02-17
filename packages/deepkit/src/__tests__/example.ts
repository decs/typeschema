import {initTRPC} from '@trpc/server';
import {typeOf} from '@deepkit/type';

import {wrap} from '..';

const schema = typeOf<{name: string}>();

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${(input as any).name}!`),
  //         ^? unknown
});

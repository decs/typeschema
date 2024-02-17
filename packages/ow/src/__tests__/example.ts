import {initTRPC} from '@trpc/server';
import ow from 'ow';

import {wrap} from '..';

const schema = ow.object.exactShape({name: ow.string});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

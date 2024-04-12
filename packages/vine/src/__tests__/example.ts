import {initTRPC} from '@trpc/server';
import vine from '@vinejs/vine';

import {wrap} from '..';

const schema = vine.object({name: vine.string()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

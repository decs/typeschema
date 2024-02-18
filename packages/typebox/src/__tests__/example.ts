import {Type} from '@sinclair/typebox';
import {initTRPC} from '@trpc/server';

import {wrap} from '..';

const schema = Type.Object({name: Type.String()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

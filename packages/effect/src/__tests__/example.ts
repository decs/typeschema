import * as S from '@effect/schema/Schema';
import {initTRPC} from '@trpc/server';

import {wrap} from '..';

const schema = S.struct({name: S.string});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

import {initTRPC} from '@trpc/server';
import {IsNotEmpty} from 'class-validator';

import {wrap} from '..';

class Schema {
  @IsNotEmpty()
  name!: string;
}
const schema = Schema;

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

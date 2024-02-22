import {validate} from '@typeschema/main';
import {z} from 'zod';

export default async function Page() {
  console.log(await validate(z.string(), 'hello'));
  return null;
}

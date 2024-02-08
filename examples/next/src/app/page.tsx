import {validate} from '@typeschema/main';
import {z} from 'zod';

export default async function Page() {
  const result = await validate(z.string(), 'hello');
  return result.success
    ? result.data
    : result.issues.map(({message}) => message).join('\n');
}

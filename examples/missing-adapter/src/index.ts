import {validate} from '@typeschema/main';
import {string} from 'valibot';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
validate<any>(string(), 'hello')
  .then(() => {
    throw new Error('Unexpected success');
  })
  .catch(error => {
    if (
      !error.message.startsWith("Cannot find package '@typeschema/valibot'")
    ) {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  });

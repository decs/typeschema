import {validate} from '@typeschema/main';
import {string} from 'valibot';

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

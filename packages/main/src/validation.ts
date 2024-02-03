/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {select} from './selector';

const importValibotValidationAdapter = async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/valibot'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
};

const importZodValidationAdapter = async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/zod'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
};

export const validationAdapter: ValidationAdapter<AdapterResolver> = select({
  valibot: async schema => (await importValibotValidationAdapter())(schema),
  zod: async schema => (await importZodValidationAdapter())(schema),
});

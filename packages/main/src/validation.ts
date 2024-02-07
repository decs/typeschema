/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

import {memoize} from '@typeschema/core';

import {select} from './selector';

const importAjvValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/ajv'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importArktypeValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/arktype'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importDeepkitValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/deepkit'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importEffectValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/effect'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importFunctionValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/function'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importIoTsValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/io-ts'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importJoiValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/joi'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importOwValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/ow'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importRuntypesValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/runtypes'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importSuperstructValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/superstruct'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importTypeboxValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/typebox'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importValibotValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/valibot'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importYupValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/yup'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importZodValidationAdapter = memoize(async () => {
  try {
    const {validationAdapter} = await import(
      /* webpackIgnore: true */ '@typeschema/zod'
    );
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

export const validationAdapter: ValidationAdapter<AdapterResolver> = select({
  ajv: async schema => (await importAjvValidationAdapter())(schema),
  arktype: async schema => (await importArktypeValidationAdapter())(schema),
  deepkit: async schema => (await importDeepkitValidationAdapter())(schema),
  effect: async schema => (await importEffectValidationAdapter())(schema),
  function: async schema => (await importFunctionValidationAdapter())(schema),
  ioTs: async schema => (await importIoTsValidationAdapter())(schema),
  joi: async schema => (await importJoiValidationAdapter())(schema),
  ow: async schema => (await importOwValidationAdapter())(schema),
  runtypes: async schema => (await importRuntypesValidationAdapter())(schema),
  superstruct: async schema => (await importSuperstructValidationAdapter())(schema),
  typebox: async schema => (await importTypeboxValidationAdapter())(schema),
  valibot: async schema => (await importValibotValidationAdapter())(schema),
  yup: async schema => (await importYupValidationAdapter())(schema),
  zod: async schema => (await importZodValidationAdapter())(schema),
});

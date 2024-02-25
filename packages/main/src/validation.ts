/**
 * This file is generated. Do not modify it manually!
 */

import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {memoize, unsupportedAdapter} from '@typeschema/core';

import {select} from './selector';

const importArktypeValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/arktype';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/arktype');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importClassValidatorValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/class-validator';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/class-validator');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importDeepkitValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/deepkit';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/deepkit');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importEffectValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/effect';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/effect');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importFunctionValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/function';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/function');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importIoTsValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/io-ts';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/io-ts');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importJoiValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/joi';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/joi');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importJsonValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/json';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/json');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importOwValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/ow';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/ow');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importRuntypesValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/runtypes';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/runtypes');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importSuperstructValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/superstruct';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/superstruct');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importTypeboxValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/typebox';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/typebox');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importValibotValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/valibot';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/valibot');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importYupValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/yup';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/yup');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

const importZodValidationAdapter = memoize(async () => {
  try {
    const moduleName = '@typeschema/zod';
    const {validationAdapter} = (await import(
      /* webpackIgnore: true */ moduleName
    )) as typeof import('@typeschema/zod');
    return validationAdapter;
  } catch (error) {
    throw error;
  }
});

export const validationAdapter: ValidationAdapter<AdapterResolver> = select({
  arktype: async schema => (await importArktypeValidationAdapter())(schema),
  classValidator: async schema => (await importClassValidatorValidationAdapter())(schema),
  deepkit: async schema => (await importDeepkitValidationAdapter())(schema),
  effect: async schema => (await importEffectValidationAdapter())(schema),
  function: async schema => (await importFunctionValidationAdapter())(schema),
  ioTs: async schema => (await importIoTsValidationAdapter())(schema),
  joi: async schema => (await importJoiValidationAdapter())(schema),
  json: async schema => (await importJsonValidationAdapter())(schema),
  ow: async schema => (await importOwValidationAdapter())(schema),
  runtypes: async schema => (await importRuntypesValidationAdapter())(schema),
  superstruct: async schema => (await importSuperstructValidationAdapter())(schema),
  typebox: async schema => (await importTypeboxValidationAdapter())(schema),
  valibot: async schema => (await importValibotValidationAdapter())(schema),
  yup: async schema => (await importYupValidationAdapter())(schema),
  zod: async schema => (await importZodValidationAdapter())(schema),
});

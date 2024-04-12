/**
 * This file is generated. Do not modify it manually!
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {AdapterResolvers} from './adapters';
import type {AdapterResolver} from './resolver';
import type {ValidationAdapter} from '@typeschema/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {memoize, unsupportedAdapter} from '@typeschema/core';

import {select} from './selector';

const importArktypeValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/arktype');
  return validationAdapter;
});

const importClassValidatorValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/class-validator');
  return validationAdapter;
});

const importDeepkitValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/deepkit');
  return validationAdapter;
});

const importEffectValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/effect');
  return validationAdapter;
});

const importFastestValidatorValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/fastest-validator');
  return validationAdapter;
});

const importFunctionValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/function');
  return validationAdapter;
});

const importIoTsValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/io-ts');
  return validationAdapter;
});

const importJoiValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/joi');
  return validationAdapter;
});

const importJsonValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/json');
  return validationAdapter;
});

const importOwValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/ow');
  return validationAdapter;
});

const importRuntypesValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/runtypes');
  return validationAdapter;
});

const importSuperstructValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/superstruct');
  return validationAdapter;
});

const importSuretypeValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/suretype');
  return validationAdapter;
});

const importTypeboxValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/typebox');
  return validationAdapter;
});

const importValibotValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/valibot');
  return validationAdapter;
});

const importValitaValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/valita');
  return validationAdapter;
});

const importVineValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/vine');
  return validationAdapter;
});

const importYupValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/yup');
  return validationAdapter;
});

const importZodValidationAdapter = memoize(async () => {
  const {validationAdapter} = await import('@typeschema/zod');
  return validationAdapter;
});

export const validationAdapter: ValidationAdapter<AdapterResolver> = select({
  arktype: async schema => (await importArktypeValidationAdapter())(schema),
  classValidator: async schema => (await importClassValidatorValidationAdapter())(schema),
  deepkit: async schema => (await importDeepkitValidationAdapter())(schema),
  effect: async schema => (await importEffectValidationAdapter())(schema),
  fastestValidator: async schema => (await importFastestValidatorValidationAdapter())(schema),
  function: async schema => (await importFunctionValidationAdapter())(schema),
  ioTs: async schema => (await importIoTsValidationAdapter())(schema),
  joi: async schema => (await importJoiValidationAdapter())(schema),
  json: async schema => (await importJsonValidationAdapter())(schema),
  ow: async schema => (await importOwValidationAdapter())(schema),
  runtypes: async schema => (await importRuntypesValidationAdapter())(schema),
  superstruct: async schema => (await importSuperstructValidationAdapter())(schema),
  suretype: async schema => (await importSuretypeValidationAdapter())(schema),
  typebox: async schema => (await importTypeboxValidationAdapter())(schema),
  valibot: async schema => (await importValibotValidationAdapter())(schema),
  valita: async schema => (await importValitaValidationAdapter())(schema),
  vine: async schema => (await importVineValidationAdapter())(schema),
  yup: async schema => (await importYupValidationAdapter())(schema),
  zod: async schema => (await importZodValidationAdapter())(schema),
});

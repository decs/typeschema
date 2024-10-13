import type {AdapterResolver} from './resolver';
import type {ValidationAdapter, ValidationIssue} from '@typeschema/core';

import {memoize} from '@typeschema/core';
import {ValidationError} from 'class-validator';

const importValidationModule = memoize(async () => {
  const {validate} = await import('class-validator');
  return {validate};
});

function getIssues(
  error: ValidationError,
  parentPath: Array<PropertyKey>,
): Array<ValidationIssue> {
  const path = [
    ...parentPath,
    Number.isInteger(+error.property) ? +error.property : error.property,
  ];
  return Object.values(error.constraints ?? {})
    .map((message): ValidationIssue => ({message, path}))
    .concat(
      error.children?.flatMap(childError => getIssues(childError, path)) ?? [],
    );
}

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {validate} = await importValidationModule();
  return async data => {
    const errors = await validate(Object.assign(new schema(), data));
    if (errors.length === 0) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: errors.flatMap(error => getIssues(error, [])),
      success: false,
    };
  };
};

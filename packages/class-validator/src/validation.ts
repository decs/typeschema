/* eslint-disable prettier/prettier */
import type {AdapterResolver} from './resolver';
import type {ValidationAdapter, ValidationIssue} from '@typeschema/core';

import {memoize} from '@typeschema/core';
import { ValidationError } from "class-validator";

const importValidationModule = memoize(async () => {
  const {validate} = await import('class-validator');
  return {validate};
});

export const validationAdapter: ValidationAdapter<
  AdapterResolver
> = async schema => {
  const {validate} = await importValidationModule();
  return async data => {
    function getIssues(error: ValidationError, parentPath = ""): ValidationIssue[] {
      const currentPath = parentPath
        ? Number.isInteger(+error.property) ? `${parentPath}[${error.property}]` : `${parentPath}.${error.property}`
        : error.property;
      const constraints = error.constraints ? Object.values(error.constraints) : [];
      const childIssues = error.children ? error.children.flatMap(childError => getIssues(childError, currentPath)) : [];

      return [
          ...constraints.map((message) => ({
              message: message,
              path: [currentPath],
          })),
          ...childIssues
      ];
    }

    const errors = await validate(Object.assign(new schema(), data));
    if (errors.length === 0) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
        success: true,
      };
    }
    return {
      issues: errors.flatMap(error => getIssues(error)),
      success: false,
    };
  };
};

/**
 * This file is generated. Do not modify it manually!
 */

import type {JestConfigWithTsJest} from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        compiler: 'ts-patch/compiler',
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
} satisfies JestConfigWithTsJest;

import type {JestConfigWithTsJest} from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
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

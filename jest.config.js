/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/*.test.ts"],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {tsconfig: 'tsconfig.test.json'},
    ],
  }
};

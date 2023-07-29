/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/*.test.ts"],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        compiler: 'ts-patch/compiler',
        tsconfig: 'tsconfig.test.json'
      },
    ],
  }
};

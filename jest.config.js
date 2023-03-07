/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '\\.[jt]sx?$': [
      'ts-jest', {
        tsConfig: 'tsconfig.json',
        diagnostics: {
          warnOnly: true,
        }
      }
    ]
  },
  clearMocks: true,
  coverageDirectory: 'coverage',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '@/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testMatch: null,
};

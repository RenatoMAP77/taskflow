import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  verbose: true,
  testTimeout: 10000,
  moduleNameMapper: {
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@repositories/(.*)': '<rootDir>/src/repositories/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@routes/(.*)': '<rootDir>/src/routes/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1'
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml'
    }]
  ]
};

export default config;

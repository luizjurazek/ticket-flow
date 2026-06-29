module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@swagger/(.*)$': '<rootDir>/src/shared/infra/swagger/$1',
  },
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(uuid|@faker-js/faker)/)'],
  testMatch: ['**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '\\.integration\\.spec\\.ts$'],
  coveragePathIgnorePatterns: ['<rootDir>/src/shared/infra/swagger/decorators/', '/node_modules/'],
};

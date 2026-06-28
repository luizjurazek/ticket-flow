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
};

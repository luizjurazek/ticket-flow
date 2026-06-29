module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/*.integration.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  globalSetup: '<rootDir>/src/test/integration/global-setup.ts',
  globalTeardown: '<rootDir>/src/test/integration/global-teardown.ts',
};

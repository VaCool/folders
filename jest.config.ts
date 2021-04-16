export default {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};

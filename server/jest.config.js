module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  verbose: true
};

module.exports = {
  verbose: true,
  collectCoverageFrom: [
    '**/*.{js}',
    '!**/node_modules/**',
    '!**/vendor/**'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  reporters: ['default']
}

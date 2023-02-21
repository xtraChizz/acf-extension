module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/constant/**/*.{js,jsx}', '!src/helpers/browser.js', '!src/**/index.js', '!**/node_modules/**', '!**/vendor/**'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'babel',
  setupFilesAfterEnv: ['./jest.setup.js'],
  reporters: ['default'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!@dhruv-techapps/.*)'],
  transform: {
    '/node_modules/@dhruv-techapps/.+\\.js$': 'babel-jest',
    '^.+\\.js$': 'babel-jest'
  }
}

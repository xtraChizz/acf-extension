const standard = require('@neutrinojs/standardjs');
const library = require('@neutrinojs/library');
const jest = require('@neutrinojs/jest');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standard(),
    library({
      name: 'core-common'
    }),
    jest({
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      reporters: ["default"]
    }),
  ],
};

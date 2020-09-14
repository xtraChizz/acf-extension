const standard = require('@neutrinojs/standardjs');
const library = require('@neutrinojs/library');
const jest = require('@neutrinojs/jest');
const copy = require('@neutrinojs/copy');
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');

const srcDir = '_prod';
if(process.env.NODE_ENV === 'development'){
  srcDir = '_dev'
}else if(process.env.NODE_ENV === 'preprod'){
  srcDir = '_beta'
}
const manifest = require(`./${srcDir}/manifest.json`);

module.exports = {
  options: {
    root: __dirname,
    output: 'dist',
    targets: false,
    mains:{
      content_scripts:'./content_scripts/index.js',
      background:'./background/index.js'
    }
  },
  use: [
    standard(),
    library({
      name: ["[name]"],
      libraryTarget:'var',
      clean: true,
      externals: {
        whitelist: ["@dhruv-techapps/acf-common", "@dhruv-techapps/core-extension"],
      },
    }),
    jest({
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      reporters: ["default"]
    }),
    (neutrino) => {
      if (process.env.NODE_ENV === 'production') {
        neutrino.config.plugin('zip').use(new ZipPlugin({
          path: './../build/chrome',
          filename: `${manifest.name.replace(/\W+/g, "-").toLowerCase()}-v${manifest.version}.zip`,
          zipOptions: {
            forceZip64Format: false,
          }
        }))
      }
      neutrino.config.plugin('merge').use(new MergeJsonWebpackPlugin({
        "files": [
          "./src/manifest.json",
          `./${srcDir}/manifest.json`
        ],
        "output": {
          "fileName": "./manifest.json"
        }
      }))
    },
    copy({
      patterns: [
        { from:  `./_locales`, to:  './_locales'},
        { from:  `./${srcDir}/assets`, to:  './assets'}
      ],
      options: {
        logLevel:  process.env.NODE_ENV === 'production' ? 'warn': 'debug' 
      },
      pluginId: 'copy',
    }),
  ],
  
};

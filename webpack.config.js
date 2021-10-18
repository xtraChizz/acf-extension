/* eslint-disable import/no-dynamic-require */
const webpack = require('webpack') // to access built-in plugins
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MergeJsonPlugin = require('merge-json-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const merge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  Object.keys(source).forEach(key => {
    if (source[key] instanceof Object) {
      Object.assign(source[key], merge(target[key], source[key]))
    }
  })

  // Join `target` and modified `source`
  Object.assign(target || {}, source)
  return target
}

module.exports = ({ goal }, { mode }) => {
  const srcDir = goal || '_prod'
  const devtool = mode === 'development' ? 'inline-source-map' : false
  // eslint-disable-next-line global-require
  const manifest = require(`./${srcDir}/manifest.json`)

  return {
    mode: 'production',
    target: 'web',
    devtool,
    entry: {
      content_scripts: './src/content_scripts/index.js',
      background: './src/background/index.js'
    },
    stats: {
      children: false,
      logging: 'warn'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    resolve: {
      extensions: ['.js'],
      modules: ['src', 'node_modules']
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({ mode: JSON.stringify({ env: goal }) }),
      new ESLintPlugin({
        cache: true,
        fix: true,
        emitError: true,
        failOnError: true
      }),
      new MergeJsonPlugin({
        groups: [
          {
            files: ['./src/manifest.json', `./${srcDir}/manifest.json`],
            to: './manifest.json'
          }
        ],
        mergeFn: merge
      }),
      new CopyPlugin({
        patterns: [
          { from: './_locales', to: './_locales' },
          { from: './sounds', to: './sounds' },
          { from: `./${srcDir}/assets`, to: './assets' }
        ]
      }),
      ...(mode !== 'development'
        ? [
            new ZipPlugin({
              path: `./../build/${srcDir}`,
              filename: `${manifest.name.replace(/\W+/g, '-').toLowerCase()}-v${manifest.version}.zip`
            })
          ]
        : [])
    ]
  }
}

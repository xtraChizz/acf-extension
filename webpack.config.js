/* eslint-disable import/no-dynamic-require */
const webpack = require('webpack') // to access built-in plugins
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = env => {
  const srcDir = env ? env.srcDir || '_prod' : '_prod'
  const devtool = env ? env.devtool || 'none' : 'none'
  // eslint-disable-next-line global-require
  const manifest = require(`./${srcDir}/manifest.json`)

  return {
    mode: 'production',
    target: 'web',
    devtool: devtool,
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
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.js'],
      modules: ['src', 'node_modules']
    },
    devServer: {
      contentBase: './dist',
      hot: true
    },
    module: {
      rules: []
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new ESLintPlugin({
        cache: true,
        fix: true,
        emitError: true,
        failOnError: true
      }),
      new CleanWebpackPlugin({
        dry: false,
        verbose: true
      }),
      new MergeJsonWebpackPlugin({
        files: ['./src/manifest.json', `./${srcDir}/manifest.json`],
        output: {
          fileName: './manifest.json'
        }
      }),
      new ZipPlugin({
        path: `./../build/${srcDir}`,
        filename: `${manifest.name.replace(/\W+/g, '-').toLowerCase()}-v${manifest.version}.zip`,
        zipOptions: {
          forceZip64Format: false
        }
      }),
      new CopyPlugin({
        patterns: [
          { from: './_locales', to: './_locales' },
          { from: './sounds', to: './sounds' },
          { from: `./${srcDir}/assets`, to: './assets' }
        ]
      })
    ]
  }
}

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const PACKAGE = require('./package.json')

function modify(buffer, name, version, { KEY }) {
  // copy-webpack-plugin passes a buffer
  const manifest = JSON.parse(buffer.toString())

  // make any modifications you like, such as
  manifest.version = version
  manifest.name = name
  if (KEY) {
    manifest.key = KEY
  }

  return JSON.stringify(manifest, null, 2)
}

module.exports = ({ name, variant, devtool = false }, { WEBPACK_WATCH }) => ({
  mode: 'production',
  target: 'web',
  devtool,
  entry: {
    content_scripts: './src/content_scripts/index.js',
    background: './src/background/index.js',
    wizard: './src/wizard/index.js',
    popup: ['./src/popup/index.js', './src/popup/popup.scss']
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
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          {
            loader: 'file-loader',
            options: { publicPath: path.resolve(__dirname, 'dist'), outputPath: 'css/', name: '[name].min.css' }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    new ESLintPlugin({
      cache: true,
      fix: true,
      emitError: true,
      failOnError: true
    }),
    new CopyPlugin({
      patterns: [
        { from: './_locales', to: './_locales' },
        { from: `./assets/${variant}`, to: './assets' },
        { from: `./*.html`, to: './html', context: 'src/popup' },
        { from: './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', to: './' },
        {
          from: './src/manifest.json',
          to: './manifest.json',
          transform(content) {
            return modify(content, name, PACKAGE.version, process.env)
          }
        }
      ]
    }),
    ...(!WEBPACK_WATCH
      ? [
          new ZipPlugin({
            path: `./../build/`,
            filename: `${name.replace(/\W+/g, '-').toLowerCase()}-v${PACKAGE.version}.zip`
          })
        ]
      : [])
  ]
})

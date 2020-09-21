module.exports = {
  root: true,
  extends: ['standard'],
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'no-new': [0]
  },
  env: {
    es6: true, browser: true, commonjs: true, webextensions: true, jest: true
  },
  globals: {
    process: true
  },
  parserOptions: {
    ecmaVersion: 2018, sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src']
      }
    }
  }
}

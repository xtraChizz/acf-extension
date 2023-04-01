const crypto = require('crypto')

Object.assign(global, require('jest-chrome'), { process: { env: { FUNCTION_URL: 'https://notify/', VARIANT: 'TEST' } } })

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length),
    randomUUID: () => crypto.randomUUID
  }
})

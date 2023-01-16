import { Logger } from '@dhruv-techapps/core-common'
import { ConfigError } from '../error'

export const VALUE_MATCHER = {
  SHEET: /^Sheet::[\w|-]+::\w[$|\d]$/i,
  QUERY_PARAM: /^Query::/i,
  RANDOM: /<random(\[.+?\])?(\{(\d+),?(\d+)?\})?>/gi,
  BATCH_REPEAT: /<batchRepeat>/
}

/*
 * Random Number Constant
 */
const CAP_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SMALL_ALPHA = 'abcdefghijklmnopqrstuvwxyz'
const SPECIAL_CHAR = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
const NUM = '0123456789'

const Value = (() => {
  const getRandomValue = value =>
    value.replace(VALUE_MATCHER.RANDOM, (match, range, _, start = 6, end = undefined) => {
      let characters
      switch (range) {
        case '[A-Z]':
          characters = CAP_ALPHA
          break
        case '[a-z]':
          characters = SMALL_ALPHA
          break
        case '[^a-z]':
          characters = CAP_ALPHA + SPECIAL_CHAR + NUM
          break
        case '[^A-Z]':
          characters = SMALL_ALPHA + SPECIAL_CHAR + NUM
          break
        case '[\\d]':
          characters = NUM
          break
        case '[\\D]':
          characters = CAP_ALPHA + SMALL_ALPHA
          break
        case '[\\w]':
          characters = `${CAP_ALPHA + SMALL_ALPHA + NUM}_`
          break
        case '[\\W]':
          characters = SPECIAL_CHAR
          break
        case '[.]':
          characters = CAP_ALPHA + SMALL_ALPHA + SPECIAL_CHAR + NUM
          break
        default:
          characters = range?.match(/\[(.+)\]/)[1] || CAP_ALPHA + SMALL_ALPHA + SPECIAL_CHAR + NUM
      }
      const charactersLength = characters.length
      let result = ''
      let length = start
      if (end) {
        length = Math.floor(Math.random() * Number(end)) + Number(start)
      }
      for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      Logger.colorDebug('GetRandomValue', result)
      return result
    })

  const getSheetValue = (value, batchRepeat, sheets) => {
    const [, sheetName, sheetCol] = value.split('::')
    const rowIndex = sheetCol[1] === '$' ? batchRepeat : parseInt(sheetCol[1], 10)
    const colIndex = sheetCol[0].charCodeAt(0) - 65
    if (!sheets[sheetName]) {
      throw new ConfigError(`Sheet: "${sheetName}" not found!`, 'Sheet not found')
    } else if (!sheets[sheetName][rowIndex]) {
      throw new ConfigError(`Sheet "${sheetName}" do not have Row ${rowIndex}`, 'Sheet row not found')
    } else if (colIndex < 0 || colIndex > 25) {
      throw new ConfigError(`Invalid column letter "${sheetCol[0]}" in value:${value}`, 'Sheet column invalid')
    } else {
      value = sheets[sheetName][rowIndex][colIndex]
    }
    Logger.colorDebug('GetSheetValue', value)
    return value
  }

  const getQueryParam = value => {
    const [, key] = value.split('::')
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has(key)) {
      value = searchParams.get(key)
    }
    Logger.colorDebug('GetQueryParam', value)
    return value
  }

  const getBatchRepeat = (value, batchRepeat) => {
    value = value.replaceAll('<batchRepeat>', batchRepeat)
    Logger.colorDebug('GetBatchRepeat', value)
    return value
  }

  const getValue = (value, batchRepeat, sheets) => {
    /// For select box value is boolean true
    if (typeof value !== 'string') {
      Logger.colorDebug('Value', value)
      return value
    }
    switch (true) {
      case VALUE_MATCHER.SHEET.test(value):
        return getSheetValue(value, batchRepeat, sheets)
      case VALUE_MATCHER.QUERY_PARAM.test(value):
        return getQueryParam(value)
      case VALUE_MATCHER.BATCH_REPEAT.test(value):
        return getBatchRepeat(value, batchRepeat)
      case VALUE_MATCHER.RANDOM.test(value):
        return getRandomValue(value, batchRepeat)
      default:
        return value
    }
  }

  return { getValue }
})()

export default Value

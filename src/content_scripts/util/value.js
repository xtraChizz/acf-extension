import { Logger } from '@dhruv-techapps/core-common'
import { ConfigError } from '../error'

export const VALUE_MATCHER = {
  GOOGLE_SHEETS: /^GoogleSheets::/i,
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

  const getBatchRepeat = (value, batchRepeat) => {
    value = value.replaceAll('<batchRepeat>', batchRepeat)
    Logger.colorDebug('GetBatchRepeat', value)
    return value
  }

  const getSheetValue = (value, batchRepeat, sheets) => {
    const [sheetName, range] = value.split('::')[1].split('!')
    if (!sheets || !sheets[sheetName]) {
      throw new ConfigError(`Sheet: "${sheetName}" not found!`, 'Sheet not found')
    }
    const { startRange, values, sessionCount } = sheets[sheetName]
    if (!values) {
      throw new ConfigError(`Sheet "${sheetName}" do not have value in ${startRange}`, 'Sheet values not found')
    }
    const currentRange = range.replaceAll('<batchRepeat>', batchRepeat + 1).replaceAll('<sessionCount>', sessionCount)
    if (!/(\D+)(\d+)/.test(currentRange)) {
      throw new ConfigError(`Sheet range is not valid${range}`, 'Sheet range invalid')
    }
    const [, column, row] = /(\D+)(\d+)/.exec(currentRange)
    const [, columnStart, rowStart] = /(\D+)(\d+)/.exec(startRange)
    const colIndex = column.split('').reduce((a, c, i) => a + c.charCodeAt(0) - columnStart.charCodeAt(0) + i * 26, 0)
    const rowIndex = row - Number(rowStart)
    if (!values[rowIndex] || !values[rowIndex][colIndex]) {
      throw new ConfigError(`Sheet "${sheetName}" do not have value in ${column}${row}`, 'Sheet cell not found')
    }
    value = values[rowIndex][colIndex]
    Logger.colorDebug('Google Sheet Value', value)
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

  const getValue = (value, batchRepeat, sheets) => {
    /// For select box value is boolean true
    if (typeof value !== 'string') {
      Logger.colorDebug('Value', value)
      return value
    }

    switch (true) {
      case VALUE_MATCHER.GOOGLE_SHEETS.test(value):
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

import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import { Service } from '@dhruv-techapps/core-services'
import Session from './session'

export default class GoogleSheets {
  getSheets(config, batchHighestRepeat) {
    const sheets = new Map()
    let sessionCount
    config.actions
      .filter(({ value }) => /^googlesheets::/i.test(value))
      .forEach(({ value }) => {
        value = value.replace(/googlesheets::/i, '')
        const [sheetName, range] = value.split('!')
        const ranges = sheets.get(sheetName) || new Set()
        if (value.includes('<batchRepeat>')) {
          ranges.add(range.replace('<batchRepeat>', 1))
          ranges.add(range.replace('<batchRepeat>', batchHighestRepeat + 1))
        } else if (value.includes('<sessionCount>')) {
          sessionCount = sessionCount || (sessionCount = Session.getCount())
          ranges.add(range.replace('<sessionCount>', sessionCount))
        } else {
          ranges.add(range)
        }
        sheets.set(sheetName, ranges)
      })
    return { sheets, sessionCount }
  }

  transformSheets(sheets) {
    sheets.forEach((ranges, sheetName) => {
      let lowestColumn = 'ZZ'
      let highestColumn = 'A'
      let lowestRow = 999
      let hightestRow = 1
      ranges.forEach(range => {
        if (/(\D+)(\d+)/.test(range)) {
          const [, column, row] = /(\D+)(\d+)/.exec(range)
          const rowIndex = Number(row)
          // Highest Range
          if (highestColumn.length < column.length || highestColumn < column) {
            highestColumn = column
          }
          if (hightestRow < rowIndex) {
            hightestRow = rowIndex
          }
          // Lowest Range
          if (lowestColumn.length > column.length || lowestColumn > column) {
            lowestColumn = column
          }
          if (lowestRow > rowIndex) {
            lowestRow = rowIndex
          }
        }
      })
      sheets.set(sheetName, `${lowestColumn}${lowestRow}:${highestColumn}${hightestRow}`)
    })
  }

  transformResult(result, sessionCount) {
    return result.reduce((a, c) => {
      const { range, values } = c
      const [sheetName, ranges] = range.split('!')
      const [startRange, endRange] = ranges.split(':')
      a[sheetName] = { startRange, endRange, values, sessionCount }
      return a
    }, {})
  }

  async getValues(config) {
    if (config.spreadsheetId) {
      const batchHighestRepeat = config.batch.repeat
      const { sheets, sessionCount } = this.getSheets(config, batchHighestRepeat)
      this.transformSheets(sheets)
      let result = await Service.message(chrome.runtime.id, {
        action: RUNTIME_MESSAGE_ACF.GOOGLE_SHEETS,
        spreadsheetId: config.spreadsheetId,
        ranges: Array.from(sheets, ([sheetName, range]) => `${sheetName}!${range}`)
      })
      result = this.transformResult(result, sessionCount)
      Logger.colorDebug('Google Sheets', result)
      return result
    }
    return null
  }
}

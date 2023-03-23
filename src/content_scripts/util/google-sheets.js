import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import { Service } from '@dhruv-techapps/core-services'

export default class GoogleSheets {
  getSheets(config, batchHighestRepeat) {
    const sheets = new Map()
    config.actions
      .filter(({ value }) => /^googlesheets::/i.test(value))
      .forEach(({ value }) => {
        const [sheetName, range] = value
          .replace(/googlesheets::/i, '')
          .replace('<batchRepeat>', batchHighestRepeat + 1)
          .replace('<batchCount>', batchHighestRepeat + 2)
          .split('!')
        const ranges = sheets.get(sheetName) || new Set()
        ranges.add(range)
        sheets.set(sheetName, ranges)
      })
    return sheets
  }

  transformSheets(sheets) {
    sheets.forEach((ranges, sheetName) => {
      let lowestColumn = 'ZZ'
      let highestColumn = 'A'
      let lowestRow = 999
      let hightestRow = 1
      ranges.forEach(range => {
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
      })
      sheets.set(sheetName, `${lowestColumn}${lowestRow}:${highestColumn}${hightestRow}`)
    })
  }

  transformResult(result) {
    return result.reduce((a, c) => {
      const { range, values } = c
      const [sheetName, ranges] = range.split('!')
      const [startRange, endRange] = ranges.split(':')
      a[sheetName] = { startRange, endRange, values }
      return a
    }, {})
  }

  async getValues(config) {
    if (config.spreadsheetId) {
      const batchHighestRepeat = config.batch.repeat
      const sheets = this.getSheets(config, batchHighestRepeat)
      this.transformSheets(sheets)
      const result = await Service.message(chrome.runtime.id, {
        action: RUNTIME_MESSAGE_ACF.GOOGLE_SHEETS,
        spreadsheetId: config.spreadsheetId,
        ranges: Array.from(sheets, ([sheetName, range]) => `${sheetName}!${range}`)
      })
      return this.transformResult(result)
    }
    return null
  }
}

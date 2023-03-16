import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import { Service } from '@dhruv-techapps/core-services'

export default class GoogleSheets {
  static async getValues(config) {
    if (config.spreadsheetId) {
      const batchHighestRepeat = config.batch.repeat
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
      sheets.forEach((ranges, sheetName) => {
        const lowestColumn = 'A'
        let highestColumn = 'A'
        const lowestRow = 1
        let hightestRow = 1
        ranges.forEach(range => {
          const [, column, row] = /(\D+)(\d+)/.exec(range)
          if (highestColumn.length < column.length || highestColumn < column) {
            highestColumn = column
          }
          if (hightestRow < Number(row)) {
            hightestRow = Number(row)
          }
        })
        sheets.set(sheetName, `${lowestColumn}${lowestRow}:${highestColumn}${hightestRow}`)
      })
      const response = await Service.message(chrome.runtime.id, {
        action: RUNTIME_MESSAGE_ACF.GOOGLE_SHEETS,
        spreadsheetId: config.spreadsheetId,
        ranges: Array.from(sheets, ([sheetName, range]) => `${sheetName}!${range}`)
      })
      Logger.colorDebug('Google Sheets', response)
      if (response.length === 0) {
        return null
      }
      return response.reduce((a, c) => {
        a[c.range.split('!')[0]] = c.values
        return a
      }, {})
    }
    return null
  }
}

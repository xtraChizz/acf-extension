import Common from './common'
import Addon from './addon'
import { wait } from './util'
import { ExecCommandEvents, FormEvents, LocationCommandEvents, MouseEvents, PlainEvents, ScrollToEvents } from './events'

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/

const Action = ((Common) => {
  let elements
  const start = async (action, actionIndex, batchIndex) => {
    // Logger.debug('\t\t\t\t Action >> start')
    await wait(action.initWait)
    if (await Addon.check(action.addon, action.settings)) {
      const elementFinder = action.elementFinder.replaceAll('<batchIndex>', batchIndex).replaceAll('<actionIndex>', actionIndex)
      elements = await Common.start(elementFinder, action.settings)
      if (elements) {
        _checkAction(action.value.replaceAll('<batchIndex>', batchIndex).replaceAll('<actionIndex>', actionIndex))
      }
    }
  }

  const _setValue = (value) => {
    // Logger.debug('\t\t\t\t Action >> _setValue')
    if (value.match(SHEET_MATCHER)) {
      try {
        const [, sheetName, sheetCol] = value.split('::')
        const rowIndex = sheetCol[1] === '$' ? window.dataEntryIndex : parseInt(sheetCol[1])
        const colIndex = sheetCol[0].charCodeAt(0) - 65
        if (!window.sheets[sheetName]) {
          this.notify(`Sheet "${sheetName}" not found`)
          this.error(`Sheet "${sheetName}" not found`)
        } else if (!window.sheets[sheetName][rowIndex]) {
          this.notify(`Sheet "${sheetName}" dont have Row ${rowIndex}`)
          this.error(`Sheet "${sheetName}" not found`)
        } else if (colIndex < 0 || colIndex > 25) {
          this.notify(`Invalid column letter "${sheetCol[0]}" in value:${value}`)
          this.error(`Invalid column letter "${sheetCol[0]}" in value:${value}`)
        } else {
          value = window.sheets[sheetName][rowIndex][colIndex]
        }
      } catch (error) {
        this.error(error)
      }
    }
    this.value = value
  }

  const _checkAction = (value) => {
    // Logger.debug('\t\t\t\t Action >> _checkAction')
    if (value) {
      if (/^scrollto::/gi.test(value)) {
        ScrollToEvents.start(elements, value)
      } else if (/^clickevents::/gi.test(value)) {
        MouseEvents.start(elements, value)
      } else if (/^events::/gi.test(value)) {
        FormEvents.start(elements, value)
      } else if (/^execcommand::/gi.test(value)) {
        ExecCommandEvents.start(elements, value)
      } else if (/^locationcommand::/gi.test(value)) {
        LocationCommandEvents.start(value)
      } else {
        PlainEvents.start(elements, value)
      }
    } else {
      MouseEvents.start(elements, 'ClickEvents::click')
    }
  }

  return { start, _setValue }
})(Common)

export default Action

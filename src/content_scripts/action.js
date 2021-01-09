import Common from './common'
import Addon from './addon'
import { wait } from './util'
import { ExecCommandEvents, FormEvents, LocationCommandEvents, MouseEvents, PlainEvents, ScrollToEvents } from './events'

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/

const Action = ((Common) => {
  let elements, repeat, repeatInterval
  const start = async (action, batchRepeat) => {
    // Logger.debug('\t\t\t\t Action >> start')
    await wait(action.initWait, 'Action Wait')
    if (await Addon.check(action.addon, action.settings)) {
      const elementFinder = action.elementFinder.replaceAll('<batchRepeat>', batchRepeat)
      elements = await Common.start(elementFinder, action.settings)
      if (elements) {
        repeat = action.repeat - 1
        repeatInterval = action.repeatInterval
        const value = action.value.replaceAll('<batchRepeat>', batchRepeat)
        await _checkAction(value)
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
          this.notify(`Sheet "${sheetName}" do not have Row ${rowIndex}`)
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

  const _checkAction = async (value) => {
    // Logger.debug('\t\t\t\t Action >> _checkAction')
    if (value) {
      if (/^scrollto::/gi.test(value)) {
        ScrollToEvents.start(elements, value)
      } else if (/^clickevents::/gi.test(value) || /^mouseevents::/gi.test(value)) {
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
      for (const element of elements) {
        element.click()
      }
    }
    await _repeatFunc(value)
  }

  const _repeatFunc = async (value) => {
    // Logger.debug('\t\t\t\t Action >> _repeatFunc')
    if (repeat > 0 || repeat < -1) {
      repeat--
      await wait(repeatInterval, 'Action Repeat')
      _checkAction(value)
    }
  }

  return { start, _setValue }
})(Common)

export default Action

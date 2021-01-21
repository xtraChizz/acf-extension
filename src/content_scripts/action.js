import Common from './common'
import Addon from './addon'
import { wait } from './util'
import { ExecCommandEvents, FormEvents, LocationCommandEvents, MouseEvents, PlainEvents, ScrollToEvents, KeyEvents } from './events'
import { ConfigError } from './error'
import { GAService, Logger } from '@dhruv-techapps/core-common'

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/

const Action = ((Common) => {
  let elements, repeat, repeatInterval
  const start = async (action, batchRepeat, sheets) => {
    // Logger.debug('\t\t\t\t Action >> start')
    await wait(action.initWait, 'Action Wait')
    if (await Addon.check(action.addon, action.settings)) {
      const elementFinder = action.elementFinder.replaceAll('<batchRepeat>', batchRepeat)
      elements = await Common.start(elementFinder, action.settings)
      if (elements) {
        repeat = action.repeat - 1
        repeatInterval = action.repeatInterval
        const value = _getValue(action.value, batchRepeat, sheets)
        await _checkAction(value)
      }
    }
  }

  const _getValue = (value, batchRepeat, sheets) => {
    // Logger.debug('\t\t\t\t Action >> _setValue')
    if (value.match(SHEET_MATCHER)) {
      try {
        const [, sheetName, sheetCol] = value.split('::')
        const rowIndex = sheetCol[1] === '$' ? batchRepeat : parseInt(sheetCol[1])
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
      } catch (e) {
        Logger.error(e)
        GAService.error({ name: e.name, stack: e.stack })
      }
    } else {
      value = value.replaceAll('<batchRepeat>', batchRepeat)
    }
    return value
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
      } else if (/^keyevents::/gi.test(value)) {
        KeyEvents.start(elements, value)
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

  return { start }
})(Common)

export default Action

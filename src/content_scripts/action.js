import { Logger } from '@dhruv-techapps/core-common'
// import { GAService } from '@dhruv-techapps/core-services'
import { ACTION_STATUS } from '@dhruv-techapps/acf-common'
import Common from './common'
import Addon from './addon'
import { wait } from './util'
import { FormEvents, KeyEvents, LocationCommandEvents, MouseEvents, PlainEvents, ScrollToEvents, TouchEvents } from './events'
import { ConfigError } from './error'
import CommonEvents, { EVENTS } from './events/common.events'
import { WindowCommandEvents } from './events/window-command.events'
import { AttributeEvents } from './events/attribute.events'
import { ClassEvents } from './events/class-list.events'
import { CopyEvents } from './events/copy.events'
import { PasteEvents } from './events/paste.events'
import { FuncEvents } from './events/func.events'
import Statement from './statement'
import { ReplaceEvents } from './events/replace.events'
import { AppendEvents } from './events/append.events'
import { PrependEvents } from './events/prepend.events'

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/i
const QUERY_PARAM_MATCHER = /^Query::/i
const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click']
const LOGGER_LETTER = 'Action'

const Action = (() => {
  let elements
  let repeat
  let repeatInterval
  let elementFinder
  let actionSettings

  const getValue = (value, batchRepeat, sheets) => {
    /// For select box value is boolean true
    if (typeof value !== 'string') {
      Logger.colorDebug('Value', value)
      return value
    }
    if (value.match(SHEET_MATCHER)) {
      try {
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
      } catch (e) {
        Logger.colorError(e)
        // GAService.error(chrome.runtime.id, { name: e.name, stack: e.stack })
      }
    } else if (value.match(QUERY_PARAM_MATCHER)) {
      const [, key] = value.split('::')
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has(key)) {
        value = searchParams.get(key)
      }
      Logger.colorDebug('Query Param', value)
    } else if (/<batchRepeat>/.test(value)) {
      value = value.replaceAll('<batchRepeat>', batchRepeat)
      Logger.colorDebug('<batchRepeat>', value)
    }

    return value
  }

  const checkAction = async (value, actionIndex) => {
    if (value) {
      let event = /^(\w+)::/.exec(value)
      if (event) {
        event = event[1].toLowerCase()
      }
      switch (event) {
        case EVENTS.SCROLL_TO:
          ScrollToEvents.start(elements, value)
          break
        case EVENTS.MOUSE_EVENTS:
        case EVENTS.CLICK_EVENTS:
          MouseEvents.start(elements, value)
          break
        case EVENTS.TOUCH_EVENTS:
          TouchEvents.start(elements, value)
          break
        case EVENTS.FORM_EVENTS:
          FormEvents.start(elements, value)
          break
        case EVENTS.KEY_EVENTS:
          KeyEvents.start(elements, value)
          break
        case EVENTS.ATTR:
          AttributeEvents.start(elements, value)
          break
        case EVENTS.CLASS:
          ClassEvents.start(elements, value)
          break
        case EVENTS.COPY:
          CopyEvents.start(elements, value)
          break
        case EVENTS.PASTE:
          PasteEvents.start(elements, value)
          break
        case EVENTS.WINDOW_COMMAND:
          WindowCommandEvents.start(value)
          break
        case EVENTS.LOCATION_COMMAND:
          LocationCommandEvents.start(value)
          break
        case EVENTS.FUNC:
          FuncEvents.start(value)
          break
        case EVENTS.REPLACE:
          ReplaceEvents.start(elements, value)
          break
        case EVENTS.APPEND:
          AppendEvents.start(elements, value)
          break
        case EVENTS.PREPEND:
          PrependEvents.start(elements, value)
          break
        default:
          PlainEvents.start(elements, value)
      }
    } else {
      Logger.colorDebug('Default Click Events')
      elements.forEach(element => {
        DEFAULT_EVENT.forEach(event => {
          element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
        })
      })
    }
    // eslint-disable-next-line no-use-before-define
    return await repeatFunc(value, actionIndex)
  }

  const repeatFunc = async (value, actionIndex) => {
    if (repeat > 0 || repeat < -1) {
      await wait(repeatInterval, `${LOGGER_LETTER} Repeat`, repeat, '<interval>')
      repeat -= 1
      elements = await Common.start(elementFinder, actionSettings)
      if (elements) {
        return await checkAction(value, actionIndex)
      }
    }
    Logger.groupEnd(`${LOGGER_LETTER} #${actionIndex}`)
    return ACTION_STATUS.DONE
  }

  const start = async (action, batchRepeat, sheets, actions, actionIndex) => {
    Logger.group(`${LOGGER_LETTER} #${actionIndex}`)
    actionSettings = action.settings
    if (await Statement.check(actions, action.statement)) {
      await wait(action.initWait, `${LOGGER_LETTER} initWait`)
      if (await Addon.check(actionSettings, batchRepeat, action.addon)) {
        elementFinder = action.elementFinder.replaceAll('<batchRepeat>', batchRepeat)
        elements = await Common.start(elementFinder, actionSettings)
        if (elements) {
          repeat = action.repeat
          repeatInterval = action.repeatInterval
          const value = getValue(action.value, batchRepeat, sheets)
          return await checkAction(value, actionIndex)
        }
      }
    }
    Logger.groupEnd(`${LOGGER_LETTER} #${actionIndex}`)
    return ACTION_STATUS.SKIPPED
  }

  return { start }
})()

export default Action

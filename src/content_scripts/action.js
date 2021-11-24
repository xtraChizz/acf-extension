import { Logger } from '@dhruv-techapps/core-common'
import { GAService } from '@dhruv-techapps/core-services'
import Common from './common'
import Addon from './addon'
import { wait } from './util'
import { FormEvents, KeyEvents, LocationCommandEvents, MouseEvents, PlainEvents, ScrollToEvents, TouchEvents } from './events'
import { ConfigError } from './error'
import CommonEvents from './events/common.events'
import { WindowCommandEvents } from './events/window-command.events'
import { AttributeEvents } from './events/attribute.events'
import { ClassEvents } from './events/class-list.events'
import { CopyEvents } from './events/copy.events'
import { PasteEvents } from './events/paste.events'

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/i
const QUERY_PARAM_MATCHER = /^Query::/i
const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click']

const Action = (() => {
  let elements
  let repeat
  let repeatInterval

  const getValue = (value, batchRepeat, sheets) => {
    Logger.debug('\t\t\t\t Action >> _setValue')
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
      } catch (e) {
        Logger.error(e)
        GAService.error({ name: e.name, stack: e.stack })
      }
    } else if (value.match(QUERY_PARAM_MATCHER)) {
      const [, key] = value.split('::')
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has(key)) {
        value = searchParams.get(key)
      }
    } else {
      value = value.replaceAll('<batchRepeat>', batchRepeat)
    }
    return value
  }

  const checkAction = async value => {
    Logger.debug('\t\t\t\t Action >> checkAction')
    if (value) {
      if (/^scrollto::/gi.test(value)) {
        ScrollToEvents.start(elements, value)
      } else if (/^clickevents::/gi.test(value) || /^mouseevents::/gi.test(value)) {
        MouseEvents.start(elements, value)
      } else if (/^touchevents::/gi.test(value)) {
        TouchEvents.start(elements, value)
      } else if (/^formevents::/gi.test(value)) {
        FormEvents.start(elements, value)
      } else if (/^keyevents::/gi.test(value)) {
        KeyEvents.start(elements, value)
      } else if (/^attr::/gi.test(value)) {
        AttributeEvents.start(elements, value)
      } else if (/^class::/gi.test(value)) {
        ClassEvents.start(elements, value)
      } else if (/^copy::/gi.test(value)) {
        CopyEvents.start(elements, value)
      } else if (/^paste::/gi.test(value)) {
        PasteEvents.start(elements, value)
      } else if (/^windowcommand::/gi.test(value)) {
        WindowCommandEvents.start(value)
      } else if (/^locationcommand::/gi.test(value)) {
        LocationCommandEvents.start(value)
      } else {
        PlainEvents.start(elements, value)
      }
    } else {
      elements.forEach(element => {
        DEFAULT_EVENT.forEach(event => {
          element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
        })
      })
    }
    // eslint-disable-next-line no-use-before-define
    await repeatFunc(value)
  }

  const repeatFunc = async value => {
    Logger.debug('\t\t\t\t Action >> repeatFunc')
    if (repeat > 0 || repeat < -1) {
      repeat -= 1
      await wait(repeatInterval, 'Action Repeat')
      await checkAction(value)
    }
  }

  const start = async (action, batchRepeat, sheets) => {
    Logger.debug('\t\t\t\t Action >> start')
    await wait(action.initWait, 'Action Wait')
    if (await Addon.check(action.addon, action.settings)) {
      const elementFinder = action.elementFinder.replaceAll('<batchRepeat>', batchRepeat)
      elements = await Common.start(elementFinder, action.settings)
      if (elements) {
        repeat = action.repeat - 1
        repeatInterval = action.repeatInterval
        const value = getValue(action.value, batchRepeat, sheets)
        await checkAction(value)
      }
    }
  }

  return { start }
})()

export default Action

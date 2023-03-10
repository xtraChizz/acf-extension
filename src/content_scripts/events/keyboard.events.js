import { Logger } from '@dhruv-techapps/core-common'
import { SystemError } from '../error'
import CommonEvents from './common.events'

import KEYBOARD_KEY_CODES from './keyboard-keycode.json'

const KEYBOARD_EVENT_KEYDOWN = 'keydown'
const KEYBOARD_EVENT_KEYUP = 'keyup'
const KEYBOARD_EVENT_KEYPRESS = 'keypress'

export const KeyboardEvents = (() => {
  const getVerifiedEvents = events => {
    Logger.colorDebug(`getVerifiedEvents`, events)
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined')
    }

    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1]
    let result
    try {
      result = JSON.parse(events)
    } catch (error) {
      result = events.split('+').reduce((a, c) => {
        switch (true) {
          case /shift/i.test(c):
            a.shiftKey = true
            break
          case /alt/i.test(c):
            a.altKey = true
            break
          case /ctrl/i.test(c):
            a.ctrlKey = true
            break
          case /meta/i.test(c):
            a.metaKey = true
            break
          default:
            a.key = c
            a.code = c
            c = c.toLowerCase()
            a.charCode = KEYBOARD_KEY_CODES[c]
            a.keyCode = KEYBOARD_KEY_CODES[c]
            a.which = KEYBOARD_KEY_CODES[c]
        }
        return a
      }, {})
    }
    return result
  }
  const dispatchEvent = async (element, events) => {
    element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYDOWN, { ...CommonEvents.getKeyboardEventProperties(events), charCode: 0 }))
    element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYPRESS, { ...CommonEvents.getKeyboardEventProperties(events) }))
    element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYUP, { ...CommonEvents.getKeyboardEventProperties(events), charCode: 0 }))
  }

  const start = (elements, event) => {
    const events = getVerifiedEvents(event)
    Logger.colorDebug(`Keyboard Events`, events)
    CommonEvents.loopElements(elements, events, dispatchEvent)
  }
  return { start }
})()

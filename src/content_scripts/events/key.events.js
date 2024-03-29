import { Logger } from '@dhruv-techapps/core-common'
import { ConfigError, SystemError } from '../error'
import { wait } from '../util'
import CommonEvents from './common.events'

// KeyEvents::{value:'Example text',delay:300}
// KeyEvents::Example text

const KEYBOARD_EVENT_KEYDOWN = 'keydown'
const KEYBOARD_EVENT_KEYUP = 'keyup'

export const KeyEvents = (() => {
  const getVerifiedEvents = events => {
    Logger.colorDebug(`getVerifiedEvents`, events)
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined')
    }
    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1]
    let result
    try {
      const { value, delay = 0, shiftKey, ctrlKey, metaKey, altKey } = JSON.parse(events)
      if (value) {
        result = value.split('').map(event => ({ key: event, delay, shiftKey, ctrlKey, metaKey, altKey }))
      } else {
        throw new ConfigError(events, 'Invalid Events')
      }
    } catch (error) {
      Logger.colorError(error)
      result = events.split('').map(event => ({ key: event }))
    }
    if (result) {
      return result
    }
    throw new ConfigError(events, 'Invalid Events')
  }
  const dispatchEvent = async (element, events) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const event of events) {
      element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYDOWN, { ...CommonEvents.getKeyboardEventProperties(event) }))
      element.value += event.key
      element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYUP, { ...CommonEvents.getKeyboardEventProperties(event) }))
      if (event.delay) {
        await wait(event.delay, 'Key Event')
      }
    }
  }

  const start = (elements, event) => {
    const events = getVerifiedEvents(event)
    Logger.colorDebug(`KeyEvents`, events)
    CommonEvents.loopElements(elements, events, dispatchEvent)
  }
  return { start }
})()

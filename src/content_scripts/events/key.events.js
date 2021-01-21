import { Logger } from '@dhruv-techapps/core-common'
import { ConfigError, SystemError } from '../error'
import { wait } from '../util'
import CommonEvents from './common.events'

// KeyEvents::{value:'Example text',delay:300}
// KeyEvents::Example text

const KEYBOARD_EVENT_KEYDOWN = 'keydown'
const KEYBOARD_EVENT_KEYUP = 'keyup'

export const KeyEvents = ((CommonEvents) => {
  const start = (elements, event) => {
    // Logger.debug('\t\t\t\t\t KeyEvents  >> start')
    const events = _getVerifiedEvents(event)
    CommonEvents.loopElements(elements, events, _dispatchEvent)
  }

  const _getVerifiedEvents = (events) => {
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined')
    }
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
      Logger.error(error)
      result = events.split('').map(event => ({ key: event }))
    }
    if (result) {
      return result
    } else {
      throw new ConfigError(events, 'Invalid Events')
    }
  }
  const _dispatchEvent = async (element, events) => {
    for (const event of events) {
      element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYDOWN, { ...CommonEvents.getKeyboardEventProperties(event) }))
      element.value += event.key
      element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYUP, { ...CommonEvents.getKeyboardEventProperties(event) }))
      if (event.delay) {
        await wait(event.delay, 'Key Event')
      }
    }
  }
  return { start }
})(CommonEvents)

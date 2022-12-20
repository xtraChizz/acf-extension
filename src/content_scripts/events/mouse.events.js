import { Logger } from '@dhruv-techapps/core-common'
import { ConfigError, SystemError } from '../error'
import CommonEvents from './common.events'

export const MouseEvents = (() => {
  const dispatchEvent = (element, events) => {
    events.forEach(event => {
      if (typeof event === 'string') {
        element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
      } else {
        element.dispatchEvent(new MouseEvent(event.type, { ...CommonEvents.getMouseEventProperties(), ...event }))
      }
    })
  }

  const getVerifiedEvents = events => {
    Logger.colorDebug('GetVerifiedEvents', events)
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined')
    }
    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1]
    let result
    try {
      const eventObject = JSON.parse(events)
      if (Array.isArray(eventObject)) {
        result = eventObject
      } else {
        result = [eventObject]
      }
    } catch (error) {
      const event = events.replace(/\W/g, '')
      if (event) {
        result = [event]
      }
    }

    if (result) {
      return result
    }
    throw new ConfigError(`value: ${events}`, 'Invalid Events')
  }

  const start = (elements, event) => {
    const events = getVerifiedEvents(event)
    Logger.colorDebug(`MouseEvents`, events)
    CommonEvents.loopElements(elements, events, dispatchEvent)
  }
  return { start }
})()

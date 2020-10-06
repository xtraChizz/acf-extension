import { Logger } from '@dhruv-techapps/core-common'
import CommonEvents from './common.events'

export const MOUSE_EVENTS = ['contextmenu', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick', 'click']

export const MouseEvents = ((CommonEvents) => {
  const start = (elements, event) => {
    // Logger.debug('\t\t\t\t\t MouseEvents >> start')
    const events = CommonEvents.getVerifiedEvents(MOUSE_EVENTS, event)
    CommonEvents.loopElements(elements, events, _dispatchEvent)
  }
  const _dispatchEvent = (element, events) => {
    events.forEach(event => {
      if (typeof event === 'string') {
        element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEvent()))
      } else {
        element.dispatchEvent(new MouseEvent(event.type, { ...CommonEvents.getMouseEvent(), ...event }))
      }
    })
  }
  return { start }
})(CommonEvents)

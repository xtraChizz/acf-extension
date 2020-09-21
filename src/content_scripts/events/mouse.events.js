import { Logger } from '@dhruv-techapps/core-common'
import CommonEvents from './common.events'

export const MOUSE_EVENTS = ['contextmenu', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick', 'click']

export const MouseEvents = ((CommonEvents) => {
  const start = (nodes, event) => {
    Logger.log('\t\t\t\t\t MouseEvents - start')
    const events = CommonEvents.getVerifiedEvents(MOUSE_EVENTS, event)
    CommonEvents.loopNodes(nodes, events, _dispatchEvent)
  }
  const _dispatchEvent = (node, events) => {
    events.forEach(event => {
      if (typeof event === 'string') {
        node.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEvent()))
      } else {
        node.dispatchEvent(new MouseEvent(event.type, { ...CommonEvents.getMouseEvent(), ...event }))
      }
    })
  }
  return { start }
})(CommonEvents)

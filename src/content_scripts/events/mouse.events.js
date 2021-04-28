import CommonEvents from './common.events'

export const MOUSE_EVENTS = ['contextmenu', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick', 'click', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove']

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

  const start = (elements, event) => {
    // Logger.debug('\t\t\t\t\t MouseEvents >> start')
    const events = CommonEvents.getVerifiedEvents(MOUSE_EVENTS, event)
    CommonEvents.loopElements(elements, events, dispatchEvent)
  }
  return { start }
})()

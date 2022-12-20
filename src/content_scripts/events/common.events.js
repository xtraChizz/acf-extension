import { Logger } from '@dhruv-techapps/core-common'
import { ConfigError, SystemError } from '../error'

const CommonEvents = (() => {
  const getVerifiedEvents = (verifiedEvents, events) => {
    Logger.colorDebug('getVerifiedEvents', { verifiedEvents, events })
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined')
    }
    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1]
    let result
    try {
      const eventObject = JSON.parse(events)
      if (Array.isArray(eventObject)) {
        result = eventObject.filter(event => verifiedEvents.indexOf(typeof event === 'string' ? event : event.type) !== -1)
      } else if (verifiedEvents.indexOf(eventObject.type) !== -1) {
        result = [eventObject]
      }
    } catch (error) {
      const event = events.replace(/\W/g, '')
      if (verifiedEvents.indexOf(event) !== -1) {
        result = [event]
      }
    }

    if (result) {
      return result
    }
    throw new ConfigError(`value: ${events}`, 'Invalid Events')
  }

  const loopElements = (elements, events, trigger) => {
    elements.forEach(element => {
      trigger(element, events)
    })
  }

  const getFillEvent = () => {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('change', false, true)
    return event
  }
  const getMouseEventProperties = () => ({ screenX: 10, screenY: 10, clientX: 10, clientY: 10, bubbles: true, cancelable: true, view: window })

  const getPosition = el => {
    let left = 0
    let top = 0
    while (el && !Number.isNaN(el.offsetLeft) && !Number.isNaN(el.offsetTop)) {
      left += el.offsetLeft - el.scrollLeft
      top += el.offsetTop - el.scrollTop
      el = el.offsetParent
    }
    return { top, left }
  }

  const getTouch = element => {
    const offset = getPosition(element)
    return new Touch({
      identifier: Date.now(),
      target: element,
      clientX: offset.left,
      clientY: offset.top,
      radiusX: 10.5,
      radiusY: 10.5,
      rotationAngle: 10,
      force: 0.5
    })
  }

  const getTouchEventProperties = element => {
    const touch = getTouch(element)
    return {
      touches: [touch],
      targetTouches: [],
      changedTouches: [touch],
      shiftKey: true,
      cancelable: true,
      bubbles: true
    }
  }

  const getMouseEvent = () => new MouseEvent('click', getMouseEventProperties())

  const getTouchEvent = () => new TouchEvent('touchstart', getTouchEventProperties())

  const getKeyboardEventProperties = ({
    key = '',
    code = '',
    location = 0,
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    repeat = false,
    isComposing = false,
    charCode = 0,
    keyCode = 0,
    which = 0
  }) => ({ key, code, location, ctrlKey, shiftKey, altKey, metaKey, repeat, isComposing, charCode, keyCode, which })

  return { getFillEvent, getMouseEvent, getMouseEventProperties, getKeyboardEventProperties, loopElements, getVerifiedEvents, getTouchEvent, getTouchEventProperties, getTouch }
})()

export const EVENTS = {
  SCROLL_TO: 'scrollto',
  CLICK_EVENTS: 'clickevents',
  MOUSE_EVENTS: 'mouseevents',
  TOUCH_EVENTS: 'touchevents',
  FORM_EVENTS: 'formevents',
  KEY_EVENTS: 'keyevents',
  ATTR: 'attr',
  CLASS: 'class',
  COPY: 'copy',
  PASTE: 'paste',
  WINDOW_COMMAND: 'windowcommand',
  LOCATION_COMMAND: 'locationcommand',
  FUNC: 'func',
  REPLACE: 'replace',
  APPEND: 'append',
  PREPEND: 'prepend'
}

export default CommonEvents

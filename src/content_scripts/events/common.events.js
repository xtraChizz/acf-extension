import { SystemError, ConfigError } from '../error'

const CommonEvents = (() => {
  const getVerifiedEvents = (verifiedEvents, events) => {
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined')
    }
    events = events.split('::')[1]
    let result
    try {
      const eventObject = JSON.parse(events)
      if (Array.isArray(eventObject)) {
        result = eventObject.filter((event) => verifiedEvents.indexOf(typeof event === 'string' ? event : event.type) !== -1)
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
    } else {
      throw new ConfigError(`value: ${events}`, 'Invalid Events')
    };
  }

  const loopElements = (elements, events, trigger) => {
    for (const element of elements) {
      trigger(element, events)
    }
  }

  const getFillEvent = () => {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('change', false, true)
    return event
  }

  const getMouseEvent = () => {
    return new MouseEvent('click', getMouseEventProperties())
  }

  const getMouseEventProperties = () => ({ screenX: 10, screenY: 10, clientX: 10, clientY: 10, bubbles: true, cancelable: true, view: window })

  const getKeyboardEventProperties = ({ key = '', code = '', location = 0, ctrlKey = false, shiftKey = false, altKey = false, metaKey = false, repeat = false, isComposing = false, charCode = 0, keyCode = 0, which = 0 }) => ({ key, code, location, ctrlKey, shiftKey, altKey, metaKey, repeat, isComposing, charCode, keyCode, which })

  return { getFillEvent, getMouseEvent, getMouseEventProperties, getKeyboardEventProperties, loopElements, getVerifiedEvents }
})()

export default CommonEvents

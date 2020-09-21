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
      throw new ConfigError('Invalid Events', `${events} are not compatible by extension`)
    };
  }

  const loopNodes = (nodes, events, trigger) => {
    let i = 0
    while (i < nodes.snapshotLength) {
      const node = nodes.snapshotItem(i++)
      trigger(node, events)
    }
  }

  const getFillEvent = () => {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('change', false, true)
    return event
  }

  const getMouseEvent = () => {
    return new MouseEvent('click', { screenX: 10, screenY: 10, clientX: 10, clientY: 10, bubbles: true, cancelable: true, view: window })
  }

  return { getFillEvent, getMouseEvent, loopNodes, getVerifiedEvents }
})()

export default CommonEvents

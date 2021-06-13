import CommonEvents from './common.events'

export const AttributeEvents = (() => {
  const execCommand = (element, value) => {
    const [, action, name, prop] = value.split('::')
    if (action === 'set') {
      element.setAttribute(name, prop)
    } else if (action === 'remove') {
      element.removeAttribute(name)
    }
  }

  const start = (elements, value) => {
    // Logger.debug('\t\t\t\t\t WindowCommandEvents >> start')
    CommonEvents.loopElements(elements, value, execCommand)
  }
  return { start }
})()

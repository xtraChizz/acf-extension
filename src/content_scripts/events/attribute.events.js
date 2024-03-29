import { Logger } from '@dhruv-techapps/core-common'
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
    Logger.colorDebug(`AttributeEvents`, value)
    CommonEvents.loopElements(elements, value, execCommand)
  }
  return { start }
})()

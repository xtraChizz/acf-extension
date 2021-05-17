import { FORM_CLEAR_ELEMENT_NODE_NAME, FORM_ELEMENT_NODE_NAME } from '../util'
import { ConfigError, SystemError } from '../error'
import CommonEvents from './common.events'

const FORM_EVENTS = ['blur', 'change', 'contextmenu', 'click', 'focus', 'input', 'select', 'submit', 'remove', 'clear', 'reset', 'search']

export const FormEvents = (() => {
  const dispatchEvent = (element, events) => {
    if (!(element instanceof HTMLElement)) {
      throw new ConfigError(`elementFinder: ${element}`, 'Not HTMLElement')
    }
    events.forEach(event => {
      switch (typeof event === 'string' ? event : event.type) {
        case 'blur':
          element.blur()
          break
        case 'click':
          element.click()
          break
        case 'focus':
          element.focus()
          break
        case 'submit':
          if (element instanceof HTMLFormElement) {
            element.submit()
          } else if (FORM_ELEMENT_NODE_NAME.test(element.nodeName)) {
            element.form.submit()
          } else {
            throw new ConfigError(`elementFinder: ${element}`, 'Invalid Element for submit')
          }
          break
        case 'select':
          element.select()
          break
        case 'remove':
          element.remove()
          break
        case 'clear':
          if (FORM_CLEAR_ELEMENT_NODE_NAME.test(element.nodeName)) {
            element.value = ''
          } else {
            throw new ConfigError(`elementFinder: ${element}`, 'Invalid Element for clear')
          }
          break
        default:
          throw new SystemError(`Unhandled Event  "${event}"`)
      }
    })
  }

  const start = (elements, action) => {
    // Logger.debug('\t\t\t\t\t FormEvents >> start')
    const events = CommonEvents.getVerifiedEvents(FORM_EVENTS, action)
    CommonEvents.loopElements(elements, events, dispatchEvent)
  }
  return { start }
})()

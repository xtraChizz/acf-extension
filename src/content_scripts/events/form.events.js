import { Logger } from '@dhruv-techapps/core-common'
import { FORM_CLEAR_ELEMENT_NODE_NAME, FORM_ELEMENT_NODE_NAME } from '../../common/constant'
import { ConfigError, SystemError } from '../error'
import CommonEvents from './common.events'

const FORM_EVENTS = ['blur', 'click', 'focus', 'select', 'submit', 'remove', 'clear', 'reset', 'search']

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
    const events = CommonEvents.getVerifiedEvents(FORM_EVENTS, action)
    Logger.colorDebug(`FormEvents`, events)
    CommonEvents.loopElements(elements, events, dispatchEvent)
  }
  return { start }
})()

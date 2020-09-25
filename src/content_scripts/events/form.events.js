import { FORM_ELEMENT_NODENAME, FORM_CLEAR_ELEMENT_NODENAME } from '../util'
import { SystemError, ConfigError } from '../error'
import CommonEvents from './common.events'
import { Logger } from '@dhruv-techapps/core-common'

const FORM_EVENTS = ['blur', 'click', 'focus', 'select', 'submit', 'remove', 'clear']

export const FormEvents = ((CommonEvents) => {
  const start = (elements, action) => {
    Logger.debug('\t\t\t\t\t FormEvents >> start')
    const events = this._getVerifiedEvents(FORM_EVENTS, action)
    CommonEvents.loopElements(elements, events, _dispatchEvent)
  }

  const _dispatchEvent = (element, events) => {
    if (!(element instanceof HTMLElement)) {
      throw new ConfigError('Not HTMLElement', 'XPath element is not instanceof HTMLElement')
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
          } else if (FORM_ELEMENT_NODENAME.test(element.nodeName)) {
            element.form.submit()
          } else {
            throw new ConfigError('Invalid Element for submit', `Xpath element is not instance of ${FORM_ELEMENT_NODENAME}`)
          }
          break
        case 'select':
          element.select()
          break
        case 'remove':
          element.remove()
          break
        case 'clear':
          if (FORM_CLEAR_ELEMENT_NODENAME.test(element.nodeName)) {
            element.value = ''
          } else {
            throw new ConfigError('Invalid Element for clear', `Xpath element is not instance of ${FORM_CLEAR_ELEMENT_NODENAME}`)
          }
          break
        default:
          throw new SystemError('Unhandled Event', event)
      }
    })
  }
  return { start }
})(CommonEvents)

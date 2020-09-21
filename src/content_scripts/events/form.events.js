import { FORM_ELEMENT_NODENAME, FORM_CLEAR_ELEMENT_NODENAME } from '../util'
import { SystemError, ConfigError } from '../error'
import CommonEvents from './common.events'
import { Logger } from '@dhruv-techapps/core-common'

const FORM_EVENTS = ['blur', 'click', 'focus', 'select', 'submit', 'remove', 'clear']

export const FormEvents = ((CommonEvents) => {
  const start = (nodes, action) => {
    Logger.log('FormEvents - start')
    const events = this._getVerifiedEvents(FORM_EVENTS, action)
    CommonEvents.loopNodes(nodes, events, _dispatchEvent)
  }

  const _dispatchEvent = (node, events) => {
    if (!(node instanceof HTMLElement)) {
      throw new ConfigError('Not HTMLElement', 'XPath element is not instanceof HTMLElement')
    }
    const element = node
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
          if (node instanceof HTMLFormElement) {
            node.submit()
          } else if (FORM_ELEMENT_NODENAME.test(node.nodeName)) {
            node.form.submit()
          } else {
            throw new ConfigError('Invalid Element for submit', `Xpath element is not instance of ${FORM_ELEMENT_NODENAME}`)
          }
          break
        case 'select':
          node.select()
          break
        case 'remove':
          element.remove()
          break
        case 'clear':
          if (FORM_CLEAR_ELEMENT_NODENAME.test(node.nodeName)) {
            node.value = ''
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

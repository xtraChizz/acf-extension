import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../util'
import CommonEvents from './common.events'

const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click']
const CHANGE_EVENT = ['input', 'change']

export const PlainEvents = (() => {
  const checkEmptyValue = value => (value === '::empty' ? '' : value)

  const checkNode = (element, value) => {
    if (element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value
      element.dispatchEvent(CommonEvents.getFillEvent())
    } else if (element.nodeName === 'DIV' && element.isContentEditable) {
      element.textContent = value
    } else if (element.nodeName === 'OPTION') {
      element.selected = true
    } else {
      DEFAULT_EVENT.forEach(event => {
        element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
      })
    }
    CHANGE_EVENT.forEach(event => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
    })
    element.focus()
  }

  const start = (elements, value) => {
    Logger.debug('\t\t\t\t\t PlainEvents >> start')
    value = checkEmptyValue(value)
    CommonEvents.loopElements(elements, value, checkNode)
  }

  return { start }
})()

import { RADIO_CHECKBOX_NODE_NAME } from '../util'
import CommonEvents from './common.events'

export const PlainEvents = ((CommonEvents) => {
  const start = (elements, value) => {
    // Logger.debug('\t\t\t\t\t PlainEvents >> start')
    value = _checkEmptyValue(value)
    CommonEvents.loopElements(elements, value, _checkNode)
  }

  const _checkEmptyValue = (value) => {
    return value === '::empty' ? '' : value
  }

  const _checkNode = (element, value) => {
    if (element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value
      element.dispatchEvent(CommonEvents.getFillEvent())
    } else if (element.nodeName === 'DIV' && element.isContentEditable) {
      element.textContent = value
    } else {
      element.dispatchEvent(CommonEvents.getMouseEvent())
    }
    element.focus()
  }

  return { start }
})(CommonEvents)

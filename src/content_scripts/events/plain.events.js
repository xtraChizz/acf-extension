import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODENAME } from '../util'
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
    if (element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODENAME.test(element.type))) {
      element.value = value
      element.dispatchEvent(CommonEvents.getFillEvent())
    } else {
      element.dispatchEvent(CommonEvents.getMouseEvent())
    }
    element.focus()
  }

  return { start }
})(CommonEvents)

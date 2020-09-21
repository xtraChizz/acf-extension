import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODENAME } from '../util'
import CommonEvents from './common.events'

export const PlainEvents = ((CommonEvents) => {
  const start = (nodes, value) => {
    Logger.log('PlainEvents - start')
    value = _checkEmptyValue(value)
    CommonEvents.loopNodes(nodes, value, _checkNode)
  }

  const _checkEmptyValue = (value) => {
    return value === '::empty' ? '' : value
  }

  const _checkNode = (node, value) => {
    if (node.nodeName === 'SELECT' || node.nodeName === 'TEXTAREA' || (node.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODENAME.test(node.type))) {
      node.value = value
      node.dispatchEvent(CommonEvents.getFillEvent())
    } else {
      node.dispatchEvent(CommonEvents.getMouseEvent())
    }
    node.focus()
  }

  return { start }
})(CommonEvents)

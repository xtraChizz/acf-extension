import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant'
import CommonEvents from './common.events'

const CHANGE_EVENT = ['input', 'change']
export const AppendEvents = (() => {
  const checkNode = (element, value) => {
    if (element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value += value
      element.dispatchEvent(CommonEvents.getFillEvent())
    } else if (element.nodeName === 'DIV' && element.isContentEditable) {
      element.textContent += value
    }
    CHANGE_EVENT.forEach(event => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
    })
    element.focus()
  }

  const start = (elements, value) => {
    value = value.replace(/^append::/i, '')
    Logger.colorDebug(`AppendEvents`, value)
    CommonEvents.loopElements(elements, value, checkNode)
  }

  return { start }
})()

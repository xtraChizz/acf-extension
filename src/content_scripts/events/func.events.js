import { Logger } from '@dhruv-techapps/core-common'
import CommonEvents from './common.events'
import Common from '../common'
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant'

const LOGGER_LETTER = 'FuncEvents'
const CHANGE_EVENT = ['input', 'change']

export const FuncEvents = (() => {
  const checkNode = (element, value) => {
    if (element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value
      element.dispatchEvent(CommonEvents.getFillEvent())
    } else if (element.nodeName === 'DIV' && element.isContentEditable) {
      element.textContent = value
    }
    CHANGE_EVENT.forEach(event => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
    })
    element.focus()
  }

  const start = async (elements, value) => {
    try {
      Logger.groupCollapsed(LOGGER_LETTER)
      value = value.replace(/func::/i, '')
      Logger.colorDebug('Start', value)
      value = await Common.sandboxEval(value)
      CommonEvents.loopElements(elements, value, checkNode)
      Logger.groupEnd(LOGGER_LETTER)
      return true
    } catch (error) {
      Logger.groupEnd(LOGGER_LETTER)
      throw error
    }
  }
  return { start }
})()

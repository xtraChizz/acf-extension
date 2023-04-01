import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant'
import Common from '../common'
import CommonEvents from './common.events'

const LOCAL_STORAGE_COPY = 'auto-clicker-copy'
const CHANGE_EVENT = ['input', 'change']

const LOGGER_LETTER = 'PasteEvents'

export const PasteEvents = (() => {
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
      const copyContent = localStorage.getItem(LOCAL_STORAGE_COPY)
      Logger.colorDebug('Copy Content', copyContent)
      value = value.replace(/paste::/i, '')
      Logger.colorDebug('Value', value)
      value = await Common.sandboxEval(value, `'${copyContent}'`)
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

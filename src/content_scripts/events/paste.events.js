import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant'
import CommonEvents from './common.events'

const LOCAL_STORAGE_COPY = 'auto-clicker-copy'
const CHANGE_EVENT = ['input', 'change']

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

  const start = elements => {
    const value = localStorage.getItem(LOCAL_STORAGE_COPY)
    Logger.colorDebug(`PasteEvents`, value)
    CommonEvents.loopElements(elements, value, checkNode)
  }

  return { start }
})()

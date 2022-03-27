import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant'
import CommonEvents from './common.events'

const CHANGE_EVENT = ['input', 'change']

export const ReplaceEvents = (() => {
  const checkNode = (element, value) => {
    const [target, string] = value.split('::')
    if (element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      Logger.log(target)
      element.value = element.value.replace(new RegExp(target, 'g'), string)
      element.dispatchEvent(CommonEvents.getFillEvent())
    } else if (element.nodeName === 'DIV' && element.isContentEditable) {
      element.textContent = element.textContent.replace(new RegExp(target, 'g'), string)
    }
    CHANGE_EVENT.forEach(event => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()))
    })
    element.focus()
  }

  const start = (elements, value) => {
    Logger.debug('\t\t\t\t\t ReplaceEvents >> start')
    value = value.replace(/^replace::/i, '')
    CommonEvents.loopElements(elements, value, checkNode)
  }

  return { start }
})()

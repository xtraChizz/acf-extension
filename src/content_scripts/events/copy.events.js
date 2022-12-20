import { Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant'

const LOCAL_STORAGE_COPY = 'auto-clicker-copy'
const LOGGER_LETTER = 'CopyEvents'
export const CopyEvents = (() => {
  const applyFilter = (text, value) => {
    Logger.colorDebug('applyFilter', { text, value })
    if (value) {
      const matches = text.match(new RegExp(value))
      if (matches) {
        ;[text] = matches
      }
    }
    return text
  }

  const getValue = element => {
    if (element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA' || (element.nodeName === 'INPUT' && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      return element.value
    }
    if (element.nodeName === 'DIV' && element.isContentEditable) {
      return element.textContent
    }
    return element.innerText || element.innerHTML
  }

  const start = (elements, value) => {
    Logger.groupCollapsed(LOGGER_LETTER)
    Logger.colorDebug('Start', value)
    const text = getValue(elements[0])
    Logger.colorDebug('Text', text)
    const result = applyFilter(text, value.replace(/copy::/gi, ''))
    Logger.colorDebug('Result', result)
    localStorage.setItem(LOCAL_STORAGE_COPY, result)
    Logger.groupEnd(LOGGER_LETTER)
  }

  return { start }
})()

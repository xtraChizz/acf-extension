import { LocalStorage, Logger } from '@dhruv-techapps/core-common'
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant'

const LOCAL_STORAGE_COPY = 'auto-clicker-copy'

export const CopyEvents = (() => {
  const applyFilter = (text, value) => {
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
    Logger.debug('\t\t\t\t\t CopyEvents >> start')
    const text = applyFilter(getValue(elements[0]), value.replace(/copyevents::/gi, ''))
    LocalStorage.setItem(LOCAL_STORAGE_COPY, text)
  }

  return { start }
})()

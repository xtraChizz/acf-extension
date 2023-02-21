import { DataStore, Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { ActionService } from '@dhruv-techapps/core-services'
import { ConfigError } from './error/config-error'
import { wait } from './util'

const LOGGER_LETTER = 'Common'
const Common = (() => {
  const retryFunc = async (retry, retryInterval) => {
    if (retry > 0 || retry < -1) {
      ActionService.setBadgeBackgroundColor(chrome.runtime.id, { color: [102, 16, 242, 1] })
      ActionService.setBadgeText(chrome.runtime.id, { text: 'Retry' })
      await wait(retryInterval, 'Retry', retry, '<interval>')
      return true
    }
    return false
  }

  // eslint-disable-next-line no-eval
  const stringFunction = (stringFunc, parent = window) => {
    const functions = stringFunc.replace(/^func::/gi, '').split('.')
    if (functions[0].includes('new')) {
      const newFunc = functions.shift()
      switch (newFunc) {
        case 'new Date()':
          parent = new Date()
          break
        default:
          throw new ConfigError(`${newFunc} is not available contact extension developer`, 'Invalid Addon Func')
      }
    }
    return functions.reduce((acc, current) => {
      if (current.includes('(')) {
        const values = current.split('(')[1].replace(')', '').split(',')
        return acc[current.replace(/\(.*\)/, '')](values)
      }
      return acc[current]
    }, parent)
  }

  const getElements = async (document, elementFinder, retry, retryInterval) => {
    Logger.colorDebug('GetElements', elementFinder)
    let elements
    if (/^(id::|#)/gi.test(elementFinder)) {
      const element = document.getElementById(elementFinder.replace(/^(id::|#)/gi, ''))
      elements = element ? [element] : undefined
    } else if (/^Selector::/gi.test(elementFinder)) {
      const element = document.querySelector(elementFinder.replace(/^Selector::/gi, ''))
      elements = element ? [element] : undefined
    } else if (/^ClassName::/gi.test(elementFinder)) {
      elements = Array.from(document.getElementsByClassName(elementFinder.replace(/^ClassName::/gi, '')))
    } else if (/^Name::/gi.test(elementFinder)) {
      elements = Array.from(document.getElementsByName(elementFinder.replace(/^Name::/gi, '')))
    } else if (/^TagName::/gi.test(elementFinder)) {
      elements = Array.from(document.getElementsByTagName(elementFinder.replace(/^TagName::/gi, '')))
    } else if (/^SelectorAll::/gi.test(elementFinder)) {
      elements = Array.from(document.querySelectorAll(elementFinder.replace(/^SelectorAll::/gi, '')))
    } else {
      try {
        const nodes = document.evaluate(elementFinder, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        if (nodes.snapshotLength !== 0) {
          elements = []
          let i = 0
          while (i < nodes.snapshotLength) {
            elements.push(nodes.snapshotItem(i))
            i += 1
          }
        }
      } catch (e) {
        throw new ConfigError(`elementFinder: ${e.message.split(':')[1]}`, 'Invalid Xpath')
      }
    }
    if (!elements) {
      const doRetry = await retryFunc(retry, retryInterval)
      if (doRetry) {
        elements = await getElements(document, elementFinder, retry - 1, retryInterval)
      }
    }
    return elements
  }

  const main = async (elementFinder, retry, retryInterval) => await getElements(document, elementFinder, retry, retryInterval)

  const checkIframe = async (elementFinder, retry, retryInterval) => {
    Logger.colorDebug('CheckIframe')
    const iFrames = document.getElementsByTagName('iframe')
    let elements
    for (let index = 0; index < iFrames.length; index += 1) {
      if (!iFrames[index].src || iFrames[index].src === 'about:blank') {
        const { contentDocument } = iFrames[index]
        if (contentDocument) {
          elements = await getElements(contentDocument, elementFinder, retry, retryInterval)
          if (elements) {
            break
          }
        }
      }
    }
    return elements
  }

  const checkRetryOption = (retryOption, elementFinder) => {
    if (retryOption === RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload()
      } else {
        window.addEventListener('load', window.location.reload)
      }
      throw new ConfigError(`elementFinder: ${elementFinder}`, 'Not Found - RELOAD')
    } else if (retryOption === RETRY_OPTIONS.STOP) {
      throw new ConfigError(`elementFinder: ${elementFinder}`, 'Not Found - STOP')
    }
    Logger.colorInfo('RetryOption', retryOption)
  }

  const start = async (elementFinder, settings = {}) => {
    try {
      if (!elementFinder) {
        throw new ConfigError('elementFinder can not be empty!', 'Element Finder')
      }
      Logger.groupCollapsed(LOGGER_LETTER)
      const { retryOption, retryInterval, retry, checkiFrames, iframeFirst } = { ...DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS), ...settings }
      let elements
      if (iframeFirst) {
        elements = await checkIframe(elementFinder, retry, retryInterval)
      } else {
        elements = await main(elementFinder, retry, retryInterval)
      }
      if (!elements || elements.length === 0) {
        if (iframeFirst) {
          elements = await main(elementFinder, retry, retryInterval)
        } else if (checkiFrames) {
          elements = await checkIframe(elementFinder, retry, retryInterval)
        }
      }
      if (!elements || elements.length === 0) {
        checkRetryOption(retryOption, elementFinder)
      }
      Logger.groupEnd(LOGGER_LETTER)
      return elements
    } catch (error) {
      Logger.groupEnd(LOGGER_LETTER)
      throw error
    }
  }
  return { start, stringFunction, getElements }
})()

export default Common

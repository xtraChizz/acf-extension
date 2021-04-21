import { BrowserActionService, DataStore, Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { ConfigError } from './error/config-error'
import { wait } from './util'

const Common = (() => {
  const start = async (elementFinder, settings = {}) => {
    // Logger.debug('Common >> start')
    if (!elementFinder) {
      throw new ConfigError('elementFinder can not be empty!', 'Element Finder')
    }
    const { retryOption, retryInterval, retry, checkiFrames } = { ...DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS), ...settings }
    const nodes = await _getElements(document, elementFinder, retry, retryInterval, checkiFrames)
    if (!nodes || nodes.snapshotLength === 0) {
      _checkRetryOption(retryOption, elementFinder)
    }
    return nodes
  }

  const _getElements = async (document, elementFinder, retry, retryInterval, checkiFrames) => {
    // Logger.debug('Common >> _getElements')

    let elements = []
    if (/^(id::|#)/gi.test(elementFinder)) {
      const element = document.getElementById(elementFinder.replace(/^(id::|#)/gi, ''))
      elements = element ? [element] : []
    } else if (/^ClassName::/gi.test(elementFinder)) {
      elements = document.getElementsByClassName(elementFinder.replace(/^ClassName::/gi, ''))
    } else if (/^Name::/gi.test(elementFinder)) {
      elements = document.getElementsByName(elementFinder.replace(/^Name::/gi, ''))
    } else if (/^TagName::/gi.test(elementFinder)) {
      elements = document.getElementsByTagName(elementFinder.replace(/^TagName::/gi, ''))
    } else if (/^Selector::/gi.test(elementFinder)) {
      const element = document.querySelector(elementFinder.replace(/^Selector::/gi, ''))
      elements = element ? [element] : []
    } else if (/^SelectorAll::/gi.test(elementFinder)) {
      elements = document.querySelectorAll(elementFinder.replace(/^SelectorAll::/gi, ''))
    } else {
      try {
        const nodes = document.evaluate(elementFinder, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        if (nodes.snapshotLength !== 0) {
          let i = 0
          while (i < nodes.snapshotLength) {
            elements.push(nodes.snapshotItem(i++))
          }
        }
      } catch (e) {
        throw new ConfigError(`elementFinder: ${e.message.split(':')[1]}`, 'Invalid Xpath')
      }
    }
    return elements.length ? elements : await retryFunc(elementFinder, retry, retryInterval, checkiFrames)
  }

  const retryFunc = async (element, retry, retryInterval, checkiFrames) => {
    // Logger.debug('Common >> retryFunc')
    if (retry > 0) {
      retry--
      BrowserActionService.setBadgeBackgroundColor({ color: [102, 16, 242, 1] })
      BrowserActionService.setBadgeText({ text: 'Retry' })
      await wait(retryInterval, 'Retry')
      return await _getElements(document, element, retry, retryInterval, checkiFrames)
    } else if (checkiFrames) {
      return _checkIframe(element)
    }
  }

  const _checkIframe = async element => {
    // Logger.debug('Common >> _checkIframe')
    const iFrames = document.getElementsByTagName('iframe')
    let elements = []
    for (let index = 0; index < iFrames.length; index++) {
      if (elements.length !== 0) {
        break
      }
      if (iFrames[index].src === 'about:blank') {
        const contentDocument = iFrames[index].contentDocument
        if (contentDocument) {
          elements = await _getElements(contentDocument, element, 0, 0, false)
        }
      }
    }
    return elements.length ? elements : undefined
  }

  const _checkRetryOption = (retryOption, elementFinder) => {
    // Logger.debug('Common >> _checkRetryOption')
    if (retryOption === RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        location.reload()
      } else {
        window.addEventListener('load', function () {
          location.reload()
        })
      }
    } else if (retryOption === RETRY_OPTIONS.STOP) {
      throw new ConfigError(`elementFinder: ${elementFinder}`, 'Not Found')
    } else {
      Logger.log(`elementFinder: ${elementFinder} not found and action is SKIP`)
    }
  }

  return { start }
})()

export default Common

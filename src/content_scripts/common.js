import { BrowserActionService, DataStore, Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { ConfigError } from './error/config-error'
import { wait } from './util'

const Common = (() => {
  const retryFunc = async (retry, retryInterval) => {
    Logger.debug('Common >>>>>> retryFunc')
    if (retry >= 0) {
      BrowserActionService.setBadgeBackgroundColor({ color: [102, 16, 242, 1] })
      BrowserActionService.setBadgeText({ text: 'Retry' })
      await wait(retryInterval, 'Retry')
      return true
    }
    return false
  }

  const getElements = async (document, elementFinder, retry, retryInterval) => {
    Logger.debug('Common >>>>>>>> getElements')
    let elements
    if (/^(id::|#)/gi.test(elementFinder)) {
      const element = document.getElementById(elementFinder.replace(/^(id::|#)/gi, ''))
      elements = element ? [element] : undefined
    } else if (/^Selector::/gi.test(elementFinder)) {
      const element = document.querySelector(elementFinder.replace(/^Selector::/gi, ''))
      elements = element ? [element] : undefined
    } else if (/^ClassName::/gi.test(elementFinder)) {
      elements = document.getElementsByClassName(elementFinder.replace(/^ClassName::/gi, ''))
    } else if (/^Name::/gi.test(elementFinder)) {
      elements = document.getElementsByName(elementFinder.replace(/^Name::/gi, ''))
    } else if (/^TagName::/gi.test(elementFinder)) {
      elements = document.getElementsByTagName(elementFinder.replace(/^TagName::/gi, ''))
    } else if (/^SelectorAll::/gi.test(elementFinder)) {
      elements = document.querySelectorAll(elementFinder.replace(/^SelectorAll::/gi, ''))
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
    Logger.debug('Common >>>> checkIframe')
    const iFrames = document.getElementsByTagName('iframe')
    Logger.log('iFrames', iFrames)
    let elements
    for (let index = 0; index < iFrames.length; index += 1) {
      Logger.log('iFrames[index].src', iFrames[index].src)
      if (!iFrames[index].src || iFrames[index].src === 'about:blank') {
        const { contentDocument } = iFrames[index]
        Logger.log('contentDocument', contentDocument)
        if (contentDocument) {
          elements = await getElements(contentDocument, elementFinder, retry, retryInterval)
          Logger.log('elements', elements)
          if (elements) {
            break
          }
        }
      }
    }
    return elements
  }

  const checkRetryOption = (retryOption, elementFinder) => {
    Logger.debug('Common >> checkRetryOption')
    if (retryOption === RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload()
      } else {
        window.addEventListener('load', window.location.reload)
      }
    } else if (retryOption === RETRY_OPTIONS.STOP) {
      throw new ConfigError(`elementFinder: ${elementFinder}`, 'Not Found')
    } else {
      Logger.log(`elementFinder: ${elementFinder} not found and action is SKIP`)
    }
  }

  const start = async (elementFinder, settings = {}) => {
    Logger.debug('Common >> start')
    if (!elementFinder) {
      throw new ConfigError('elementFinder can not be empty!', 'Element Finder')
    }
    const { retryOption, retryInterval, retry, checkiFrames, iframeFirst } = { ...DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS), ...settings }
    let nodes
    Logger.info('checkiFrames', checkiFrames)
    Logger.info('iframeFirst', iframeFirst)
    Logger.info('retryOption', retryOption, retryInterval, retry)
    if (iframeFirst) {
      nodes = await checkIframe(elementFinder, retry, retryInterval)
    } else {
      nodes = await main(elementFinder, retry, retryInterval)
    }
    Logger.info('nodes', nodes)
    if (!nodes || nodes.length === 0) {
      if (iframeFirst) {
        nodes = await main(elementFinder, retry, retryInterval)
      } else if (checkiFrames) {
        nodes = await checkIframe(elementFinder, retry, retryInterval)
      }
    }
    Logger.info('nodes', nodes)
    if (!nodes || nodes.length === 0) {
      checkRetryOption(retryOption, elementFinder)
    }
    return nodes
  }
  return { start }
})()

export default Common

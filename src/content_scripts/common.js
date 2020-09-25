import { DataStore, Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { ConfigError } from './error/config-error'
import { wait } from './util'

const Common = (() => {
  const start = async (elementFinder) => {
    Logger.debug('Common >> start')
    const { retryOption, retryInterval, retry } = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    const nodes = await _getElements(document, elementFinder, retry, retryInterval)
    if (!nodes || nodes.snapshotLength === 0) {
      _checkRetryOption(retryOption, elementFinder)
    }
    return nodes
  }

  const _getElements = async (document, elementFinder, retry, retryInterval) => {
    Logger.debug('Common >> _getElements')

    let elements = []
    if (/^(id::|#)/gi.test(elementFinder)) {
      elements = [document.getElementById(elementFinder.replace(/^(id::|#)/gi, ''))]
    } else if (/^ClassName::/gi.test(elementFinder)) {
      elements = document.getElementsByClassName(elementFinder.replace(/^ClassName::/gi, ''))
    } else if (/^Name::/gi.test(elementFinder)) {
      elements = document.getElementsByName(elementFinder.replace(/^Name::/gi, ''))
    } else if (/^TagName::/gi.test(elementFinder)) {
      elements = document.getElementsByTagName(elementFinder.replace(/^TagName::/gi, ''))
    } else if (/^Selector::/gi.test(elementFinder)) {
      elements = [document.querySelector(elementFinder.replace(/^Selector::/gi, ''))]
    } else if (/^SelectorAll::/gi.test(elementFinder)) {
      elements = document.querySelectorAll(elementFinder.replace(/^SelectorAll::/gi, ''))
    } else if (/^\/\//gi.test(elementFinder)) {
      try {
        const nodes = document.evaluate(elementFinder, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        if (nodes.snapshotLength !== 0) {
          let i = 0
          while (i < nodes.snapshotLength) {
            elements.push(nodes.snapshotItem(i++))
          }
        }
      } catch (e) {
        throw new ConfigError(e.message.split(':')[1])
      }
    } else {
      throw new ConfigError(`Not a valid elementFinder ${elementFinder}`)
    }
    return elements.length ? elements : await retryFunc(elementFinder, retry, retryInterval)
  }

  const retryFunc = async (element, retry, retryInterval) => {
    Logger.debug('Common >> retryFunc')
    if (retry > 0) {
      retry--
      await wait(retryInterval)
      return await _getElements(document, element, retry, retryInterval)
    } else {
      return _checkIframe(element)
    }
  }

  const _checkIframe = (element) => {
    Logger.debug('Common >> _checkIframe')
    const iframes = document.getElementsByTagName('iframe')
    let _nodes
    for (let index = 0; index < iframes.length; index++) {
      if (_nodes && _nodes.snapshotLength !== 0) {
        break
      }

      const contentDocument = iframes[index].contentDocument
      if (contentDocument) {
        _nodes = document.evaluate(element, contentDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      } else {
        throw new Error('contentDocument is null for iframe')
      }
    }
    return _nodes
  }

  const _checkRetryOption = (retryOption, element) => {
    Logger.debug('Common >> _checkRetryOption')
    if (retryOption === RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        location.reload()
      } else {
        window.addEventListener('load', function () {
          location.reload()
        })
      }
    } else if (retryOption === RETRY_OPTIONS.STOP) {
      throw new ConfigError(`${element} not found and process is STOPPED`)
    } else {
      Logger.info('Element not found and action is SKIP')
    }
  }

  return { start }
})()

export default Common

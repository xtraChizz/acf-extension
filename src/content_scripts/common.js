import { DataStore, Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { ConfigError } from './error/config-error'
import { wait } from './util'

const Common = (() => {
  const start = async (element) => {
    Logger.log('Common - start')
    const { retryOption, retryInterval, retry } = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    const nodes = await _setNodes(element, retry, retryInterval)
    if (!nodes || nodes.snapshotLength === 0) {
      _checkRetryOption(retryOption, element)
    }
    return nodes
  }

  const _setNodes = async (element, retry, retryInterval) => {
    Logger.log('Common - _setNodes')
    const _nodes = document.evaluate(element, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    return _nodes.snapshotLength ? _nodes : await retryFunc(element, retry, retryInterval)
  }

  const retryFunc = async (element, retry, retryInterval) => {
    Logger.log('Common - retryFunc')
    if (retry > 0) {
      retry--
      await wait(retryInterval)
      return await _setNodes(element, retry, retryInterval)
    } else {
      return _checkIframe(element)
    }
  }

  const _checkIframe = (element) => {
    Logger.log('Common - _checkIframe')
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
    Logger.log('Common - _checkRetryOption')
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

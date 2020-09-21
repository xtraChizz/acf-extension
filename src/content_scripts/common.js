import { DataStore, Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { ConfigError } from './error/config-error'
import { wait } from './util'

const Common = (() => {
  let _settings, nodes
  const start = (element) => {
    Logger.log('Common - start')
    _settings = DataStore.getInst().getItem(LOCAL_STORAGE_KEY.SETTINGS)
    _setNodes(element)
    if (nodes.snapshotLength === 0) {
      _checkIframe(element)
    }
    if (nodes.snapshotLength === 0) {
      _checkRetryOption(element)
    }
    return nodes
  }

  const _setNodes = (element) => {
    Logger.log('Common - _setNodes')
    try {
      const _nodes = document.evaluate(element, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      if (_nodes.snapshotLength === 0) {
        retryFunc(element)
      } else {
        nodes = _nodes
      }
    } catch (error) {
      throw new ConfigError(element)
    }
  }

  const retryFunc = async (element) => {
    Logger.log('Common - retryFunc')
    if (_settings.retry > 0) {
      _settings.retry--
      await wait(_settings.retryInterval)
      _setNodes(element)
    }
  }

  const _checkIframe = (element) => {
    Logger.log('Common - _checkIframe')
    const iframes = document.getElementsByTagName('iframe')
    for (let index = 0; index < iframes.length; index++) {
      if (nodes.snapshotLength !== 0) {
        break
      }

      const contentDocument = iframes[index].contentDocument
      if (contentDocument) {
        nodes = document.evaluate(element, contentDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
      } else {
        throw new Error('contentDocument is null for iframe')
      }
    }
  }

  const _checkRetryOption = (element) => {
    Logger.log('Common - _checkRetryOption')
    if (_settings.retryOption === RETRY_OPTIONS.SKIP) {
      return 'Action skipped!'
    } else if (_settings.retryOption === RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        location.reload()
      } else {
        window.addEventListener('load', function () {
          location.reload()
        })
      }
    }
    throw new ConfigError(element)
  }

  return { start }
})()

export default Common

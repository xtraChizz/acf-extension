import { LOAD_TYPES, LOCAL_STORAGE_KEY, RUNTIME_MESSAGE_ACF, defaultSettings } from '@dhruv-techapps/acf-common'
import { DataStore, LOGGER_COLOR, Logger } from '@dhruv-techapps/core-common'

import Config from './config'
import Sandbox from './sandbox'
import Session from './util/session'

async function loadConfig(loadType) {
  try {
    const { href, host } = document.location
    chrome.runtime.sendMessage(chrome.runtime.id, { action: RUNTIME_MESSAGE_ACF.CONFIG, href, frameElement: window.top !== window.self }, async config => {
      if (config) {
        const { settings = defaultSettings } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS)
        DataStore.getInst().setItem(LOCAL_STORAGE_KEY.SETTINGS, settings)
        if ((config.loadType || settings.loadType || LOAD_TYPES.WINDOW) === loadType) {
          Logger.color(chrome.runtime.getManifest().name, undefined, LOGGER_COLOR.PRIMARY, host, loadType)
          await Config.checkStartType(settings, config)
          Logger.color(chrome.runtime.getManifest().name, undefined, LOGGER_COLOR.PRIMARY, host, 'END')
        }
      } else {
        Logger.info('No config found', window.location.href)
      }
    })
  } catch (e) {
    Logger.colorError('Error', e)
    // GAService.error(chrome.runtime.id, { name: e.name, stack: e.stack })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Session.check()
  Sandbox.init()
  loadConfig(LOAD_TYPES.DOCUMENT)
})

window.addEventListener('load', () => {
  loadConfig(LOAD_TYPES.WINDOW)
})

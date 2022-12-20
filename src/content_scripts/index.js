import { LOAD_TYPES, LOCAL_STORAGE_KEY, defaultSettings } from '@dhruv-techapps/acf-common'
import { DataStore, LOGGER_COLOR, Logger } from '@dhruv-techapps/core-common'
import { RUNTIME_MESSAGE_ACF } from '../common/constant'

import Config from './config'

async function loadConfig(loadType) {
  try {
    chrome.runtime.sendMessage(chrome.runtime.id, { action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.top !== window.self }, async config => {
      if (config) {
        const { settings = defaultSettings } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS)
        DataStore.getInst().setItem(LOCAL_STORAGE_KEY.SETTINGS, settings)
        if ((config.loadType || settings.loadType || LOAD_TYPES.WINDOW) === loadType) {
          Logger.color(undefined, undefined, LOGGER_COLOR.PRIMARY, document.location.host, loadType)
          await Config.checkStartType(settings, config)
          Logger.color(undefined, undefined, LOGGER_COLOR.PRIMARY, document.location.host, 'END')
        }
      }
    })
  } catch (e) {
    Logger.colorError('Error', e)
    // GAService.error(chrome.runtime.id, { name: e.name, stack: e.stack })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadConfig(LOAD_TYPES.DOCUMENT)
})

window.addEventListener('load', () => {
  loadConfig(LOAD_TYPES.WINDOW)
})

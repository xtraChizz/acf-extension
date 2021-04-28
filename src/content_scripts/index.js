import { LOAD_TYPES, LOCAL_STORAGE_KEY, defaultSettings } from '@dhruv-techapps/acf-common'
import { DataStore, GAService, Logger, Service, StorageService } from '@dhruv-techapps/core-common'
import { RUNTIME_MESSAGE_ACF } from '../common/constant'

import Config from './config'
import { ContextMenu } from './context_menu'

async function loadSettings(loadType) {
  try {
    // Logger.debug('\t loadSettings', loadType)
    const config = await Service.message({ action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.top !== window.self })
    if (config) {
      const setting = await StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSettings)
      DataStore.getInst().setItem(LOCAL_STORAGE_KEY.SETTINGS, setting)
      if ((config.loadType || setting.loadType || LOAD_TYPES.WINDOW) === loadType) {
        await Config.getConfig(setting, config)
      }
    }
  } catch (e) {
    Logger.error(e)
    GAService.error({ name: e.name, stack: e.stack })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings(LOAD_TYPES.DOCUMENT)
})

window.addEventListener('load', () => {
  loadSettings(LOAD_TYPES.WINDOW)
})

ContextMenu.setup()

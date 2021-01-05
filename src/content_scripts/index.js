import { LOCAL_STORAGE_KEY, LOAD_TYPES, defaultSettings } from '@dhruv-techapps/acf-common'
import { BrowserActionService, DataStore, GAService, Logger, StorageService } from '@dhruv-techapps/core-common'

import Config from './config'
import { ContextMenu } from './context_menu'

document.addEventListener('DOMContentLoaded', function () {
  loadSettings(LOAD_TYPES.DOCUMENT)
})

window.addEventListener('load', function () {
  loadSettings(LOAD_TYPES.WINDOW)
})

BrowserActionService.setBadgeText({ text: '' })
BrowserActionService.setTitle({ title: '' })
async function loadSettings (loadType) {
  try {
    // Logger.debug('INDEX')
    const setting = await StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSettings)
    DataStore.getInst().setItem(LOCAL_STORAGE_KEY.SETTINGS, setting)
    if (setting.loadType === loadType) {
      await Config.getConfig(setting.notifications)
    }
  } catch (e) {
    Logger.error(e)
    GAService.error({ name: e.name, stack: e.stack })
  }
}
ContextMenu.setup()

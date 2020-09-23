import { LOCAL_STORAGE_KEY, LOAD_TYPES, defaultSetting } from '@dhruv-techapps/acf-common'
import { DataStore, Logger, StorageService } from '@dhruv-techapps/core-common'
import { SystemError, ConfigError } from './error'

import Config from './config'
import { ContextMenu } from './context_menu'

document.addEventListener('DOMContentLoaded', function () {
  loadSettings(LOAD_TYPES.DOCUMENT)
})

window.addEventListener('load', function () {
  loadSettings(LOAD_TYPES.WINDOW)
})

async function loadSettings (loadType) {
  try {
    Logger.log('INDEX', loadType)
    const setting = await StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSetting)
    DataStore.getInst().setItem(LOCAL_STORAGE_KEY.SETTINGS, setting)
    if (setting.loadType === loadType) {
      await Config.getConfig()
    }
  } catch (e) {
    if (e instanceof SystemError) {
      console.error('INDEX', e)
    } else if (e instanceof ConfigError) {
      console.warn('INDEX', e)
    } else {
      console.error('INDEX', e)
    }
  }
}

ContextMenu.setup()

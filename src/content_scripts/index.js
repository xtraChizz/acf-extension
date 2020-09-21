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

function loadSettings (loadType) {
  try {
    Logger.log('INDEX', loadType)
    StorageService.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSetting).then(setting => {
      DataStore.getInst().setItem(LOCAL_STORAGE_KEY.SETTINGS, setting)
      if (setting.loadType === loadType) {
        Config.getConfig()
      }
    })
  } catch (e) {
    if (e instanceof SystemError) {
      console.error(e)
    } else if (e instanceof ConfigError) {
      console.error(e)
    } else {
      console.error(e)
    }
  }
}

ContextMenu.setup()

import { LOCAL_STORAGE_KEY, LOAD_TYPES, defaultSetting } from '@dhruv-techapps/acf-common'
import { RUNTIME, LOCAL_STORAGE_TYPES, DataStore } from '@dhruv-techapps/core-common'
import { onError } from './common/error'
import { getConfig } from './config'
import { ContextMenuSetup } from './context_menu'

import SystemError from './error/system-error'
import ConfigError from './error/config-error'

export const DATA_STORE_SETTINGS = 'settings'
document.addEventListener('DOMContentLoaded', function () {
  loadSettings(LOAD_TYPES.document)
})

window.addEventListener('load', function () {
  loadSettings(LOAD_TYPES.window)
})

function loadSettings (loadType) {
  try {
    const request = { action: RUNTIME.LOCAL_STORAGE, type: LOCAL_STORAGE_TYPES.GET, key: LOCAL_STORAGE_KEY.SETTINGS, fallback: defaultSetting }
    chrome.runtime.sendMessage(request, (setting) => {
      DataStore.getInst().setItem(DATA_STORE_SETTINGS, setting)
      if (setting.loadType === loadType) {
        getConfig()
      }
    })
  } catch (e) {
    if (e instanceof SystemError) {
      onError(e)
    } else if (e instanceof ConfigError) {
      console.error(e.name + ': ' + e.message)
    } else {
      console.error(e.name + ': ' + e.message)
    }
  }
}

ContextMenuSetup()

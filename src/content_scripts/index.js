import { LocalStorage, LocalStorageKey, Runtime, LocalStorageType, DataStore } from 'common-extension'
import { onError } from './common/error'
import { getConfig } from './config'
import { ContextMenuSetup } from './context_menu'
import { LoadTypeModel, defaultSetting } from '../model/setting-model'
import SystemError from './error/system-error'
import ConfigError from './error/config-error'

export const DATA_STORE_SETTINGS = 'settings'
document.addEventListener('DOMContentLoaded', function () {
  loadSettings(LoadTypeModel.document)
})

window.addEventListener('load', function () {
  loadSettings(LoadTypeModel.window)
})

function loadSettings (loadType) {
  try {
    const request = { action: LocalStorage.name, type: LocalStorageType.GET, key: LocalStorageKey.SETTINGS, fallback: defaultSetting }
    Runtime.sendMessage(request, (setting) => {
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

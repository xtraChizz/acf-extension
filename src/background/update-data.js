import { defaultSettings, LOAD_TYPES, LOCAL_STORAGE_KEY, RETRY_OPTIONS, START_TYPES } from '@dhruv-techapps/acf-common'
import { LocalStorage } from '@dhruv-techapps/core-common'

export class UpdateData {
  static checkConfig () {
    const configs = LocalStorage.getItem(LOCAL_STORAGE_KEY.CONFIGS)
    const settings = LocalStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSettings)
    if (configs && Array.isArray(configs)) {
      for (let configIndex = 0; configIndex < configs.length; configIndex++) {
        const config = configs[configIndex]

        // Update load type from settings to configuration v3.1.11
        if (settings.loadType) {
          config.loadType = settings.loadType
          delete settings.loadType
        } else if (!config.loadType) {
          config.loadType = LOAD_TYPES.WINDOW
        }
        //  v3.1.11
        if (settings.hotkey) {
          config.hotkey = settings.hotkey
          delete settings.loadType
        }
        // v3.1.11
        if (config.startManually) {
          config.startType = START_TYPES.MANUAL
          delete config.startManually
        } else if (!config.startType) {
          config.startType = START_TYPES.AUTO
        }

        // Batch Process
        if (!config.batch) {
          config.batch = {}
        }
        ['repeat', 'repeatInterval', 'refresh'].forEach(prop => {
          if (config[prop]) {
            config.batch[prop] = config[prop]
            delete config[prop]
          }
        })
        // Action Process
        if (config.actions) {
          config.actions = config.actions.map(action => {
            if (action.xpath) {
              action.elementFinder = action.xpath
              delete action.xpath
            }
            // Addon Process
            if (action.addon) {
              if (action.addon.xpath) {
                action.addon.elementFinder = action.addon.xpath
                delete action.addon.xpath
              }
              if (action.addon.retry) {
                action.addon.recheck = action.addon.retry
                action.addon.recheckInterval = action.addon.retryInterval
                delete action.addon.retry
                delete action.addon.retryInterval
              }
            }
            return action
          })
        }
      }
    }
    LocalStorage.setItem(LOCAL_STORAGE_KEY.SETTINGS, settings)
    LocalStorage.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs)
  }

  static checkSettings () {
    const settings = LocalStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS)
    if (settings) {
      if (settings.load) {
        settings.loadType = settings.load === '0' ? LOAD_TYPES.WINDOW : LOAD_TYPES.DOCUMENT
        delete settings.load
      }
      if (settings.notifications && typeof settings.notifications === 'boolean') {
        settings.notifications = { onError: settings.notifications }
      }
      if (settings.retryOption) {
        if (settings.retryOption === '0') {
          settings.retryOption = RETRY_OPTIONS.STOP
        }
        if (settings.retryOption === '1') {
          settings.retryOption = RETRY_OPTIONS.SKIP
        }
        if (settings.retryOption === '2') {
          settings.retryOption = RETRY_OPTIONS.RELOAD
        }
      }
    }
    LocalStorage.setItem(LOCAL_STORAGE_KEY.SETTINGS, settings)
  }
}

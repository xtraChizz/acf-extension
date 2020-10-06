import { LOAD_TYPES, LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { LocalStorage } from '@dhruv-techapps/core-common'

export class UpdateData {
  static checkConfig () {
    let isModified = false
    const configs = LocalStorage.getItem(LOCAL_STORAGE_KEY.CONFIGS)
    if (configs && Array.isArray(configs)) {
      for (let configIndex = 0; configIndex < configs.length; configIndex++) {
        const config = configs[configIndex]
        // Batch Process
        if (!config.batch) {
          isModified = true
          config.batch = {}
        }
        ['repeat', 'repeatInterval', 'refresh'].forEach(prop => {
          if (config[prop]) {
            isModified = true
            config.batch[prop] = config[prop]
            delete config[prop]
          }
        })
        // Action Process
        if (config.actions) {
          config.actions = config.actions.map(action => {
            if (action.xpath) {
              isModified = true
              action.elementFinder = action.xpath
              delete action.xpath
            }
            // Addon Process
            if (action.addon && action.addon.xpath) {
              isModified = true
              action.addon.elementFinder = action.addon.xpath
              delete action.addon.xpath
            }
            return action
          })
        }
      }
    }
    if (isModified) {
      console.log(configs)
      LocalStorage.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs)
    }
  }

  static checkSettings () {
    let isModified = false
    const settings = LocalStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS)
    if (settings) {
      if (settings.load) {
        isModified = true
        settings.loadType = settings.load === '0' ? LOAD_TYPES.WINDOW : LOAD_TYPES.DOCUMENT
        delete settings.load
      }
      if (settings.notifications && typeof settings.notifications === 'boolean') {
        isModified = true
        settings.notifications = { onError: settings.notifications }
      }
      if (settings.retryOption) {
        if (settings.retryOption === '0') {
          isModified = true
          settings.retryOption = RETRY_OPTIONS.STOP
        }
        if (settings.retryOption === '1') {
          isModified = true
          settings.retryOption = RETRY_OPTIONS.SKIP
        }
        if (settings.retryOption === '2') {
          isModified = true
          settings.retryOption = RETRY_OPTIONS.RELOAD
        }
      }
    }
    if (isModified) {
      console.log(settings)
      LocalStorage.setItem(LOCAL_STORAGE_KEY.SETTINGS, settings)
    }
  }
}

import { defaultAction, defaultAddon, defaultBatch, defaultConfig, defaultSettings, LOAD_TYPES, LOCAL_STORAGE_KEY, RETRY_OPTIONS } from '@dhruv-techapps/acf-common'
import { LocalStorage } from '@dhruv-techapps/core-common'

// v3.1.11 converter
export class UpdateData {
  static checkConfig () {
    const configs = LocalStorage.getItem(LOCAL_STORAGE_KEY.CONFIGS, [{ ...defaultConfig }])
    const settings = LocalStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS, { ...defaultSettings })
    if (configs && Array.isArray(configs)) {
      for (let configIndex = 0; configIndex < configs.length; configIndex++) {
        const config = { ...defaultConfig, ...configs[configIndex] }
        //* convert init wait into numbers
        if (typeof config.initWait === 'string') {
          config.initWait = Number(config.initWait)
        }

        //* Update start time to have milliseconds
        if (config.startTime && /^\d\d:\d\d:\d\d$/.test(config.startTime)) {
          config.startTime += ':000'
        }

        //* Update loadType from settings load to configuration
        if (settings.load) {
          config.loadType = settings.load === '0' ? LOAD_TYPES.WINDOW : LOAD_TYPES.DOCUMENT
        }
        //* Update loadType from settings loadType to configuration
        if (settings.loadType) {
          config.loadType = settings.loadType
        }

        /**
         * Batch create and update process
         */
        //* move refresh to batch object and delete from config
        config.batch = { ...defaultBatch, ...config.batch };
        ['refresh'].forEach(prop => {
          if (config[prop] !== undefined) {
            config.batch[prop] = config[prop]
          }
          delete config[prop]
        });
        //* convert to number and move repeat, repeat Interval to batch object and delete from config
        ['repeat', 'repeatInterval'].forEach(prop => {
          if (config[prop]) {
            config.batch[prop] = Number(config[prop])
          }
          delete config[prop]
        })

        /**
         * Action create and update process
         */
        if (config.actions) {
          config.actions = config.actions.map(action => {
            /**
             * Addon Process
             */
            //* Set addon if its not available
            if (!action.addon || !action.addon.value || (!action.addon.xpath && !action.addon.elementFinder) || !action.addon.condition) {
              action.addon = { ...defaultAddon }
            } else {
              if (!action.addon.recheck) {
                //* Set recheck from settings retry
                if (settings.retry) {
                  action.addon.recheck = Number(settings.retry)
                }
                //* Set recheckInterval from settings retryInterval
                if (settings.retryInterval) {
                  action.addon.recheckInterval = Number(settings.retryInterval)
                }
                //* Set recheckOption from settings retryOption
                if (settings.retryOption) {
                  if (settings.retryOption === '0') {
                    action.addon.recheckOption = RETRY_OPTIONS.STOP
                  }
                  if (settings.retryOption === '1') {
                    action.addon.recheckOption = RETRY_OPTIONS.SKIP
                  }
                  if (settings.retryOption === '2') {
                    action.addon.recheckOption = RETRY_OPTIONS.RELOAD
                  }
                }
              }
              action.addon = { ...defaultAddon, ...action.addon }
              //* Set elementFinder from xpath
              if (action.addon.xpath) {
                action.addon.elementFinder = action.addon.xpath
              }
              delete action.addon.xpath
            }
            action = { ...defaultAction, ...action }
            //* Update xpath to elementFinder
            if (action.xpath) {
              action.elementFinder = action.xpath
            }
            delete action.xpath

            //* Convert init wait into numbers
            if (typeof action.initWait === 'string') {
              action.initWait = Number(action.initWait)
            }

            //* Convert repeat into numbers
            if (typeof action.repeat === 'string') {
              action.repeat = Number(action.repeat)
            }

            //* Convert repeatInterval into numbers
            if (typeof action.repeatInterval === 'string') {
              action.repeatInterval = Number(action.repeatInterval)
            }

            return action
          })
        }
        configs[configIndex] = config
      }
      LocalStorage.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs)
    }
  }

  static checkSettings () {
    const settings = LocalStorage.getItem(LOCAL_STORAGE_KEY.SETTINGS, defaultSettings)
    if (settings) {
      if (settings.load) {
        delete settings.load
      }
      if (settings.notifications && typeof settings.notifications === 'boolean') {
        settings.notifications = { ...defaultSettings.notifications, onError: settings.notifications }
      }
      //* Convert retry into numbers
      if (typeof settings.retry === 'string') {
        settings.retry = Number(settings.retry)
      }

      //* Convert retryInterval into numbers
      if (typeof settings.retryInterval === 'string') {
        settings.retryInterval = Number(settings.retryInterval)
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

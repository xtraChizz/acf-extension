import { BrowserActionService, Logger, NotificationsService, SoundService, StorageService } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, START_TYPES, defaultConfig } from '@dhruv-techapps/acf-common'
import { wait } from './util'
import Batch from './batch'
import { ConfigError } from './error'
import { Hotkey } from './hotkey'

const Config = (() => {
  let config

  const processSheets = _sheets => {
    const sheets = {}
    if (Array.isArray(_sheets)) {
      _sheets.forEach(sheet => {
        sheets[sheet.name] = sheet.rows
      })
    }
    return sheets
  }

  const start = async (onConfig, onError, sound) => {
    // Logger.debug('\t Config >> start')
    try {
      const sheets = await StorageService.getItem(LOCAL_STORAGE_KEY.SHEETS, [])
      await Batch.start(config.batch, config.actions, processSheets(sheets))
      // Logger.debug('\t Config >> start >> done')
      BrowserActionService.setBadgeBackgroundColor({ color: [25, 135, 84, 1] })
      BrowserActionService.setBadgeText({ text: 'Done' })
      // ! CloudMessagingService.push({ title: 'Configuration Finished', body: config.name || config.url }).catch(console.error)
      if (onConfig) {
        NotificationsService.create({ title: 'Config Completed', message: config.name || config.url })
        if (sound) SoundService.play()
      }
    } catch (e) {
      if (e instanceof ConfigError) {
        const error = { title: e.title, message: `url : ${config.url}\n${e.message}` }
        BrowserActionService.setBadgeBackgroundColor({ color: [220, 53, 69, 1] })
        BrowserActionService.setBadgeText({ text: 'Error' })
        // ! CloudMessagingService.push({ title: 'Configuration Error', body: config.name || config.url }).catch(console.error)
        if (onError) {
          NotificationsService.create(error)
          if (sound) SoundService.play()
        } else {
          Logger.error(error)
        }
      } else {
        throw e
      }
    }
  }

  const schedule = async () => {
    // Logger.debug('\t Config >> schedule')
    const rDate = new Date()
    rDate.setHours(Number(config.startTime.split(':')[0]))
    rDate.setMinutes(Number(config.startTime.split(':')[1]))
    rDate.setSeconds(Number(config.startTime.split(':')[2]))
    rDate.setMilliseconds(Number(config.startTime.split(':')[3]))
    await new Promise(resolve => setTimeout(resolve, rDate.getTime() - new Date().getTime()))
  }

  const checkStartTime = async () => {
    // Logger.debug('\t Config >> checkStartTime')
    if (config.startTime && config.startTime.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      await schedule()
    } else {
      await wait(config.initWait, 'Configuration')
    }
  }

  const getConfig = async ({ notifications: { onConfig, onError, sound } }, _config) => {
    // Logger.debug('\t Config >> getConfig', onConfig, onError, sound, hotkey)
    if (_config) {
      config = _config
      BrowserActionService.setBadgeBackgroundColor({ color: [13, 110, 253, 1] })
      if (config.startType === START_TYPES.MANUAL || config.startManually) {
        // Logger.debug('\t Config >> start Manually')
        BrowserActionService.setBadgeText({ text: 'Manual' })
        BrowserActionService.setTitle({ title: 'Start Manually' })
        Hotkey.setup(config.hotkey || defaultConfig.hotkey, start.bind(this, onConfig, onError, sound))
      } else {
        // Logger.debug('\t Config >> start Automatically')
        BrowserActionService.setBadgeText({ text: 'Auto' })
        BrowserActionService.setTitle({ title: 'Start Automatically' })
        await checkStartTime()
        start(onConfig, onError, sound)
      }
    }
  }

  return { getConfig }
})()

// :TODO: Need to check later
/* const _processIndex = (record) => {
  dataStore.setItem(DATA_ENTRY_INDEX, -1)

  const entryIndexSession = sessionStorage.getItem(DATA_ENTRY_INDEX)
  if (entryIndexSession) {
    dataStore.setItem(DATA_ENTRY_INDEX, Number(entryIndexSession))
  }

  if (record.main) {
    let dataEntryIndex = dataStore.getItem(DATA_ENTRY_INDEX)
    dataEntryIndex++
    dataStore.setItem(DATA_ENTRY_INDEX, dataEntryIndex)
    sessionStorage.setItem(DATA_ENTRY_INDEX, dataEntryIndex)
    return dataEntryIndex < record.rows
  }

  return true
} */

export default Config

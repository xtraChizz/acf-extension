import { RUNTIME_MESSAGE_ACF } from '../common/constant'
import { BrowserActionService, Logger, NotificationsService, Service, SoundService, StorageService } from '@dhruv-techapps/core-common'
import { wait } from './util'
import Batch from './batch'
import { ConfigError } from './error'
import { Hotkey } from './hotkey'
import { defaultSettings, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'

const Config = (() => {
  let config
  const getConfig = async ({ notifications: { onConfig, onError, sound }, hotkey }) => {
    // Logger.debug('\t Config >> getConfig', onConfig, onError, sound, hotkey)
    config = await Service.message({ action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.top !== window.self })
    if (config) {
      if (config.startManually) {
        // Logger.debug('\t Config >> start Manually')
        BrowserActionService.setBadgeText({ text: 'Manual' })
        BrowserActionService.setTitle({ title: 'Start Manually' })
        Hotkey.setup(hotkey || defaultSettings.hotkey, _start.bind(this, onConfig, onError, sound))
      } else {
        // Logger.debug('\t Config >> start Automatically')
        BrowserActionService.setBadgeText({ text: 'Auto' })
        BrowserActionService.setTitle({ title: 'Start Automatically' })
        await _checkStartTime()
        _start(onConfig, onError, sound)
      }
    }
  }

  const _start = async (onConfig, onError, sound) => {
    // Logger.debug('\t Config >> _start')
    try {
      const sheets = await StorageService.getItem(LOCAL_STORAGE_KEY.SHEETS, [])
      await Batch.start(config.batch, config.actions, _processSheets(sheets))
      // Logger.debug('\t Config >> _start >> done')
      BrowserActionService.setBadgeBackgroundColor({ color: [25, 135, 84, 1] })
      BrowserActionService.setBadgeText({ text: 'Done' })
      if (onConfig) {
        NotificationsService.create({ title: 'Config Completed', message: config.name || config.url })
        sound && SoundService.play()
      }
    } catch (e) {
      if (e instanceof ConfigError) {
        const error = { title: e.title, message: `url : ${config.url}\n${e.message}` }
        BrowserActionService.setBadgeBackgroundColor({ color: [220, 53, 69, 1] })
        BrowserActionService.setBadgeText({ text: 'Error' })
        if (onError) {
          NotificationsService.create(error)
          sound && SoundService.play()
        } else {
          Logger.error(error)
        }
      } else {
        throw e
      }
    }
  }

  const _processSheets = (_sheets) => {
    const sheets = {}
    if (Array.isArray(_sheets)) {
      for (const sheet of _sheets) {
        sheets[sheet.name] = sheet.rows
      }
    }
    return sheets
  }

  const _checkStartTime = async () => {
    // Logger.debug('\t Config >> _checkStartTime')
    if (config.startTime && config.startTime.match(/^\d{2}:\d{2}:\d{2}:\d{2}$/)) {
      await _schedule()
    } else {
      await wait(config.initWait, 'Configuration')
    }
  }

  const _schedule = async () => {
    // Logger.debug('\t Config >> _schedule')
    var rDate = new Date()
    rDate.setHours(Number(config.startTime.split(':')[0]))
    rDate.setMinutes(Number(config.startTime.split(':')[1]))
    rDate.setSeconds(Number(config.startTime.split(':')[2]))
    rDate.setMilliseconds(Number(config.startTime.split(':')[3]))
    await new Promise(resolve => setTimeout(resolve, rDate.getTime() - new Date().getTime()))
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

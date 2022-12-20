import { ActionService, DiscordMessagingService, NotificationsService } from '@dhruv-techapps/core-services'
import { Logger } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, START_TYPES, defaultConfig } from '@dhruv-techapps/acf-common'
import { wait } from './util'
import Batch from './batch'
import { ConfigError } from './error'
import { Hotkey } from './hotkey'

const LOGGER_LETTER = 'Config'
const Config = (() => {
  const processSheets = async () => {
    const { sheets = [] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SHEETS)
    return sheets.reduce((accumulator, currentValue) => ({ ...accumulator, [currentValue.name]: currentValue.rows }), {})
  }

  const getFields = config => {
    Logger.colorDebug('GetFields', { url: config.url, name: config.name })
    const fields = [{ name: 'URL', value: config.url }]
    if (config.name) {
      fields.unshift({ name: 'name', value: config.name })
    }
    return fields
  }

  const start = async (config, notifications) => {
    Logger.colorDebug('Config Start')
    const { onConfig, onError, sound, discord } = notifications

    try {
      await Batch.start(config.batch, config.actions, await processSheets())
      ActionService.setBadgeBackgroundColor(chrome.runtime.id, { color: [25, 135, 84, 1] })
      ActionService.setBadgeText(chrome.runtime.id, { text: 'Done' })
      if (onConfig) {
        NotificationsService.create(chrome.runtime.id, { title: 'Config Completed', message: config.name || config.url, silent: !sound })
        if (discord) {
          DiscordMessagingService.push(chrome.runtime.id, { title: 'Configuration Finished', fields: getFields(config), color: '#198754' }).catch(Logger.colorError)
        }
      }
    } catch (e) {
      if (e instanceof ConfigError) {
        const error = { title: e.title, message: `url : ${config.url}\n${e.message}` }
        Logger.colorError('ConfigError', error)
        ActionService.setBadgeBackgroundColor(chrome.runtime.id, { color: [220, 53, 69, 1] })
        ActionService.setBadgeText(chrome.runtime.id, { text: 'Error' })
        if (onError) {
          NotificationsService.create(chrome.runtime.id, { ...error, silent: !sound }, 'error')
          if (discord) {
            DiscordMessagingService.push(chrome.runtime.id, {
              title: e.title || 'Configuration Error',
              fields: [
                ...getFields(config),
                ...e.message.split('\n').map(info => {
                  const [name, value] = info.split(':')
                  return { name, value: value.replace(/'/g, '`') }
                })
              ],
              color: '#dc3545'
            }).catch(Logger.colorError)
          }
        }
      } else {
        throw e
      }
    }
  }

  const schedule = async config => {
    Logger.colorDebug('Schedule', { startTime: config.startTime })
    const rDate = new Date()
    rDate.setHours(Number(config.startTime.split(':')[0]))
    rDate.setMinutes(Number(config.startTime.split(':')[1]))
    rDate.setSeconds(Number(config.startTime.split(':')[2]))
    rDate.setMilliseconds(Number(config.startTime.split(':')[3]))
    Logger.colorDebug('Schedule', { date: rDate })
    await new Promise(resolve => {
      setTimeout(resolve, rDate.getTime() - new Date().getTime())
    })
  }

  const checkStartTime = async config => {
    if (config.startTime && config.startTime.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      await schedule(config)
    } else {
      await wait(config.initWait, `${LOGGER_LETTER} initWait`)
    }
  }

  const checkStartType = async ({ notifications }, config) => {
    ActionService.setBadgeBackgroundColor(chrome.runtime.id, { color: [13, 110, 253, 1] })
    if (config.startType === START_TYPES.MANUAL || config.startManually) {
      Logger.colorDebug('Config Start Manually')
      ActionService.setBadgeText(chrome.runtime.id, { text: 'Manual' })
      ActionService.setTitle(chrome.runtime.id, { title: 'Start Manually' })
      Hotkey.setup(config.hotkey || defaultConfig.hotkey, start.bind(this, config, notifications))
    } else {
      Logger.colorDebug('Config Start Automatically')
      ActionService.setBadgeText(chrome.runtime.id, { text: 'Auto' })
      ActionService.setTitle(chrome.runtime.id, { title: 'Start Automatically' })
      await checkStartTime(config)
      await start(config, notifications)
    }
  }

  return { checkStartType }
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

import { RUNTIME_MESSAGE_ACF } from '../common/constant'
import { BrowserActionService, Logger, NotificationsService, Service, SoundService } from '@dhruv-techapps/core-common'
import { wait } from './util'
import Batch from './batch'
import { ConfigError } from './error'

const Config = (() => {
  let config
  const getConfig = async (notifications) => {
    // Logger.debug('\t Config >> getConfig')
    try {
      config = await Service.message({ action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.frameElement })
      if (config) {
        // dataStore.setItem(LOCAL_STORAGE_KEY.SHEETS, record.sheets)
        // if (processIndex(response.record)) {
        await _checkStartTime()
        BrowserActionService.setBadgeBackgroundColor({ color: [25, 135, 84, 1] })
        BrowserActionService.setBadgeText({ text: 'Done' })
        if (notifications.onConfig) {
          NotificationsService.create({ title: 'Config Completed', message: config.name || config.url })
          notifications.sound && SoundService.play()
        }
        /* } else {
        Logger.warn("All index are process Refresh page to start from first");
       } */
      }
    } catch (e) {
      if (e instanceof ConfigError) {
        const error = { title: e.title, message: `url : ${config.url}\n${e.message}` }
        BrowserActionService.setBadgeBackgroundColor({ color: [220, 53, 69, 1] })
        BrowserActionService.setBadgeText({ text: 'Error' })
        if (notifications.onError) {
          NotificationsService.create(error)
          notifications.sound && SoundService.play()
        } else {
          Logger.error(error)
        }
      } else {
        throw e
      }
    }
  }

  const _checkStartTime = async () => {
    // Logger.debug('\t Config >> _checkStartTime')

    if (config.startTime && config.startTime.match(/^\d{2}:\d{2}:\d{2}:\d{2}$/)) {
      await _schedule()
    } else {
      await wait(config.initWait, 'Configuration')
    }
    await Batch.start(config.batch, config.actions)
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

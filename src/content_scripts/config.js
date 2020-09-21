import { RUNTIME_MESSAGE_ACF } from '../common/constant'
import { Logger, Service } from '@dhruv-techapps/core-common'
import { wait } from './util'
import Batch from './batch'

const Config = (() => {
  let config
  const getConfig = () => {
    Logger.log('\t Config - getConfig')
    Service.message({ action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.frameElement }, _result => {
      if (_result) {
        config = _result.config
        // dataStore.setItem(LOCAL_STORAGE_KEY.SHEETS, record.sheets)
        // if (processIndex(response.record)) {
        _checkStartTime()
        /* } else {
      Logger.warn("All index are process Refresh page to start from first");
     } */
      }
    }, Logger.error)
  }

  const _checkStartTime = () => {
    Logger.log('\t Config - _checkStartTime')
    if (config.startTime && config.startTime.match(/^\d{2}:\d{2}:\d{2}$/)) {
      _schedule()
    } else {
      _startBatch()
    }
  }

  const _startBatch = async () => {
    Logger.log('\t Config - _startBatch')
    await wait(config.initWait)
    Batch.start(config.batch, config.actions)
  }

  const _schedule = async () => {
    Logger.log('\t Config - _schedule')
    var rDate = new Date()
    rDate.setHours(Number(config.startTime.split(':')[0]))
    rDate.setMinutes(Number(config.startTime.split(':')[1]))
    rDate.setSeconds(Number(config.startTime.split(':')[2]))
    await new Promise(resolve => setTimeout(resolve, rDate.getTime() - new Date().getTime()))
    _startBatch()
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

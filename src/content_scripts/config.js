import { RUNTIME_MESSAGE_ACF } from '../common/constant'
import { Logger, Service } from '@dhruv-techapps/core-common'
import { wait } from './util'
import Batch from './batch'

const Config = (() => {
  const getConfig = () => {
    Logger.log('Config - getConfig')
    Service.message({ action: RUNTIME_MESSAGE_ACF.CONFIG, href: document.location.href, frameElement: window.frameElement }).then((_config) => {
      if (_config) {
        this.config = _config
        // dataStore.setItem(LOCAL_STORAGE_KEY.SHEETS, record.sheets)
        // if (processIndex(response.record)) {
        _checkStartTime()
        /* } else {
      Logger.warn("All index are process Refresh page to start from first");
     } */
      }
    })
  }

  const _checkStartTime = () => {
    Logger.log('Config - _checkStartTime')
    if (this.config.startTime && this.config.startTime.match(/^\d{2}:\d{2}:\d{2}$/)) {
      _schedule()
    } else {
      _startBatch()
    }
  }

  const _startBatch = async () => {
    Logger.log('Config - _startBatch')
    await wait(this.config.initWait)
    Batch.start(this.config.batch, this.config.actions)
  }

  const _schedule = () => {
    Logger.log('Config - _schedule')
    var rDate = new Date()
    rDate.setHours(Number(this.config.startTime.split(':')[0]))
    rDate.setMinutes(Number(this.config.startTime.split(':')[1]))
    rDate.setSeconds(Number(this.config.startTime.split(':')[2]))
    setTimeout(_startBatch.bind(this), rDate.getTime() - new Date().getTime())
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

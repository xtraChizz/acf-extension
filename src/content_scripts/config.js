import Processor from './processor'
import { Runtime, DataStore } from 'common-extension'
import Config from '../background/config'
import Record from '../model/record-model'

const dataStore = DataStore.getInst()
const DATA_ENTRY_INDEX = 'data-entry-index'
export const DATA_STORE_SHEETS = 'sheets'

const getConfig = () => {
  Runtime.sendMessage({ action: Config.name, URL: document.location.href, frameElement: window.frameElement }, (record: Record) => {
    if (record) {
      dataStore.setItem(DATA_STORE_SHEETS, record.sheets)
      // if (processIndex(response.record)) {
      Processor(record.config)
      /* } else {
    Logger.warn("All index are process Refresh page to start from first");
   } */
    }
  })
}

// :TODO: Need to check later
const processIndex = (record) => {
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
}

export { getConfig }

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = exports.DATA_STORE_SHEETS = void 0;

var _processor = _interopRequireDefault(require("./processor"));

var _coreCommon = require("@dhruv-techapps/core-common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dataStore = _coreCommon.DataStore.getInst(); // const DATA_ENTRY_INDEX = 'data-entry-index'


const DATA_STORE_SHEETS = 'sheets';
exports.DATA_STORE_SHEETS = DATA_STORE_SHEETS;

const getConfig = () => {
  chrome.runtime.sendMessage({
    action: 'config',
    URL: document.location.href,
    frameElement: window.frameElement
  }, record => {
    if (record) {
      dataStore.setItem(DATA_STORE_SHEETS, record.sheets); // if (processIndex(response.record)) {

      new _processor.default(record.config);
      /* } else {
      Logger.warn("All index are process Refresh page to start from first");
      } */
    }
  });
}; // :TODO: Need to check later

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


exports.getConfig = getConfig;
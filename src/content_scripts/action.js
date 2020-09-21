import { Logger } from '@dhruv-techapps/core-common'
import Common from './common'
import Addon from './addon'
import { wait } from './util'
import { ExecCommandEvents, FormEvents, LocationCommandEvents, MouseEvents, PlainEvents, ScrollToEvents } from './events'

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/

const Action = ((Common) => {
  const start = async (action) => {
    Logger.log('Action - start')
    await wait(action.initWait)
    await Common.start.call(this, action.element)
    await Addon.start(action.addon)
    _checkAction(action.value)
  }

  const _setValue = (value) => {
    Logger.log('Action - _setValue')
    if (value.match(SHEET_MATCHER)) {
      try {
        const [, sheetName, sheetCol] = value.split('::')
        const rowIndex = sheetCol[1] === '$' ? window.dataEntryIndex : parseInt(sheetCol[1])
        const colIndex = sheetCol[0].charCodeAt(0) - 65
        if (!window.sheets[sheetName]) {
          this.notify(`Sheet "${sheetName}" not found`)
          this.error(`Sheet "${sheetName}" not found`)
        } else if (!window.sheets[sheetName][rowIndex]) {
          this.notify(`Sheet "${sheetName}" dont have Row ${rowIndex}`)
          this.error(`Sheet "${sheetName}" not found`)
        } else if (colIndex < 0 || colIndex > 25) {
          this.notify(`Invalid column letter "${sheetCol[0]}" in value:${value}`)
          this.error(`Invalid column letter "${sheetCol[0]}" in value:${value}`)
        } else {
          Logger.log(value, sheetName, rowIndex, colIndex)
          value = window.sheets[sheetName][rowIndex][colIndex]
        }
      } catch (error) {
        this.error(error)
      }
    }
    this.value = value
  }

  const _checkAction = (value) => {
    Logger.log('Action - _checkAction')
    if (value) {
      if (/^scrollto::/gi.test(value)) {
        ScrollToEvents.start(this._nodes, value)
      } else if (/^clickevents::/gi.test(value)) {
        MouseEvents.start(this._nodes, value)
      } else if (/^events::/gi.test(value)) {
        FormEvents.start(this._nodes, value)
      } else if (/^execcommand::/gi.test(value)) {
        ExecCommandEvents.start(this._nodes, value)
      } else if (/^locationcommand::/gi.test(value)) {
        LocationCommandEvents.start(this._nodes, value)
      } else {
        PlainEvents.start(this._nodes, value)
      }
    } else {
      MouseEvents.start(this._nodes, 'ClickEvents::click')
    }
  }

  return { start, _setValue }
})(Common)

export default Action

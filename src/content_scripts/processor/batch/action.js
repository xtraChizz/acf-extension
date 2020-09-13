import { Common, Addon, ScrollTo, Fill, ExecCommand, LocationCommand } from './action/index'
import { ClickEvents, FormEvents } from './action/event'
import { Logger } from '@dhruv-techapps/core-extension'

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/

export default class Action extends Common {
  constructor (data, url, batchCounter) {
    super()
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      try {
        this.xpath = data.xpath.replace('[$]', `[${batchCounter}]`)
        this.url = url
        this.rows = data.rows || 0
        this.setValue(data.value)
        this.checkAddon(data)
      } catch (error) {
        this.error(error)
      }
    })
  }

  setValue (value) {
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

  checkAddon (data) {
    if (data.addon) {
      new Addon(data.addon, this.url).then(response => {
        if (response.indexOf('Skipped') !== -1) {
          this.success(response)
        } else {
          this.initWait(data)
        }
      }).catch(this.error.bind(this))
    } else {
      this.initWait(data)
    }
  }

  initWait (data) {
    if (String(data.initWait).match('e') !== null) {
      const range = String(data.initWait).split('e')
      setTimeout(this.start.bind(this, 'check'), (Math.floor(Math.random() * range[1] * 1000) + range[0] * 1000))
    } else {
      setTimeout(this.start.bind(this, 'check'), (data.initWait || 0) * 1000)
    }
  }

  check () {
    if (this.value) {
      if (/^scrollto::/gi.test(this.value)) {
        new ScrollTo(this._nodes, this.value).then(this.successFunc).catch(this.error)
      } else if (/^clickevents::/gi.test(this.value)) {
        new ClickEvents(this._nodes, this.value).then(this.successFunc).catch(this.error)
      } else if (/^formevents::/gi.test(this.value)) {
        new FormEvents(this._nodes, this.value).then(this.successFunc).catch(this.error)
      } else if (/^execcommand::/gi.test(this.value)) {
        new ExecCommand(this._value).then(this.successFunc).catch(this.error)
      } else if (/^locationcommand::/gi.test(this.value)) {
        new LocationCommand(this._value).then(this.successFunc).catch(this.error)
      } else {
        new Fill(this._nodes, this.value).then(this.successFunc).catch(this.error)
      }
    } else {
      new ClickEvents(this.nodes, 'ClickEvents::click').then(this.successFunc).catch(this.error)
    }
  }

 successFunc = () => {
   this.success(`${this.xpath} action executed Successfully!`)
 }
}

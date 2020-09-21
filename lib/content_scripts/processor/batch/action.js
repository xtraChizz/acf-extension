"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = require("./action/index");

var _event = require("./action/event");

var _coreCommon = require("@dhruv-techapps/core-common");

const SHEET_MATCHER = /^Sheet::[\w|-]+::\w[$|\d]$/;

class Action extends _index.Common {
  constructor(data, url, batchCounter) {
    super();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      try {
        this.xpath = data.xpath.replace('[$]', `[${batchCounter}]`);
        this.url = url;
        this.rows = data.rows || 0;
        this.setValue(data.value);
        this.checkAddon(data);
      } catch (error) {
        this.error(error);
      }
    });
  }

  setValue(value) {
    if (value.match(SHEET_MATCHER)) {
      try {
        const [, sheetName, sheetCol] = value.split('::');
        const rowIndex = sheetCol[1] === '$' ? window.dataEntryIndex : parseInt(sheetCol[1]);
        const colIndex = sheetCol[0].charCodeAt(0) - 65;

        if (!window.sheets[sheetName]) {
          this.notify(`Sheet "${sheetName}" not found`);
          this.error(`Sheet "${sheetName}" not found`);
        } else if (!window.sheets[sheetName][rowIndex]) {
          this.notify(`Sheet "${sheetName}" dont have Row ${rowIndex}`);
          this.error(`Sheet "${sheetName}" not found`);
        } else if (colIndex < 0 || colIndex > 25) {
          this.notify(`Invalid column letter "${sheetCol[0]}" in value:${value}`);
          this.error(`Invalid column letter "${sheetCol[0]}" in value:${value}`);
        } else {
          _coreCommon.Logger.log(value, sheetName, rowIndex, colIndex);

          value = window.sheets[sheetName][rowIndex][colIndex];
        }
      } catch (error) {
        this.error(error);
      }
    }

    this.value = value;
  }

  checkAddon(data) {
    if (data.addon) {
      new _index.Addon(data.addon, this.url).then(response => {
        if (response.indexOf('Skipped') !== -1) {
          this.success(response);
        } else {
          this.initWait(data);
        }
      }).catch(this.error.bind(this));
    } else {
      this.initWait(data);
    }
  }

  initWait(data) {
    if (String(data.initWait).match('e') !== null) {
      const range = String(data.initWait).split('e');
      setTimeout(this.start.bind(this, 'check'), Math.floor(Math.random() * range[1] * 1000) + range[0] * 1000);
    } else {
      setTimeout(this.start.bind(this, 'check'), (data.initWait || 0) * 1000);
    }
  }

  check() {
    if (this.value) {
      if (/^scrollto::/gi.test(this.value)) {
        new _index.ScrollTo(this._nodes, this.value).then(this.successFunc).catch(this.error);
      } else if (/^clickevents::/gi.test(this.value)) {
        new _event.ClickEvents(this._nodes, this.value).then(this.successFunc).catch(this.error);
      } else if (/^events::/gi.test(this.value)) {
        new _event.Events(this._nodes, this.value).then(this.successFunc).catch(this.error);
      } else if (/^execcommand::/gi.test(this.value)) {
        new _index.ExecCommand(this._value).then(this.successFunc).catch(this.error);
      } else if (/^locationcommand::/gi.test(this.value)) {
        new _index.LocationCommand(this._value).then(this.successFunc).catch(this.error);
      } else {
        new _index.Fill(this._nodes, this.value).then(this.successFunc).catch(this.error);
      }
    } else {
      new _event.ClickEvents(this.nodes, 'ClickEvents::click').then(this.successFunc).catch(this.error);
    }
  }

  successFunc() {
    this.success(`${this.xpath} action executed Successfully!`);
  }

}

exports.default = Action;
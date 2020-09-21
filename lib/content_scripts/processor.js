"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _batch = _interopRequireDefault(require("./processor/batch"));

var _common = _interopRequireDefault(require("./processor/batch/action/common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Processor {
  constructor(config) {
    if (config && config.enable) {
      if (config.startTime && config.startTime.match(/^\d{2}:\d{2}:\d{2}$/)) {
        this.schedule(config);
      } else {
        this.startBatch(config);
      }
    }
  }

  async startBatch(config) {
    await _common.default.wait(config.initWait);
    new _batch.default(config);
  }

  schedule(config) {
    var rDate = new Date();
    rDate.setHours(Number(config.startTime.split(':')[0]));
    rDate.setMinutes(Number(config.startTime.split(':')[1]));
    rDate.setSeconds(Number(config.startTime.split(':')[2]));
    setTimeout(this.startBatch.bind(this, config), rDate.getTime() - new Date().getTime());
  }

}

exports.default = Processor;
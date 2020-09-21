"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _action = _interopRequireDefault(require("./batch/action"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Batch {
  constructor(batch, actions) {
    this.startAction(batch, actions);
  }

  async startAction(batch, actions) {
    if (batch.repeat) {
      for (var i = 0; i < batch.repeat; i++) {
        if (batch.repeatInterval) {
          setTimeout(function () {
            new _action.default(actions);
          }, batch.repeatInterval * 1000);
        } else {
          new _action.default(actions);
        }
      }
    } else {
      new _action.default(actions);
    }
  }

}

exports.default = Batch;
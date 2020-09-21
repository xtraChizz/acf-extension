"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = _interopRequireDefault(require("./common"));

var _regex = require("./../../../common/regex");

var _event = require("./event");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Fill extends _common.default {
  process(value) {
    value = this.checkEmptyValue(value);
    this.loopNodes(value);
    return `${value} filled successfully!`;
  }

  checkEmptyValue(value) {
    return value === '::empty' ? '' : value;
  }

  loopNodes(value) {
    let i = 0;

    while (i < this._nodes.snapshotLength) {
      const node = this._nodes.snapshotItem(i++);

      this.checkNode(node, value);
    }
  }

  checkNode(node, value) {
    if (node) {
      if (node.nodeName === 'SELECT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT' && !_regex.RADIO_CHECKBOX_NODENAME.test(node.type)) {
        node.value = value;
        return this.dispatchEvent(node);
      } else {
        return new _event.ClickEvents(node, 'ClickEvents::click').catch(this.error.bind(this));
      }
    }
  }

  dispatchEvent(node) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', false, true);
    node.dispatchEvent(event);
    node.focus();
  }

}

exports.default = Fill;
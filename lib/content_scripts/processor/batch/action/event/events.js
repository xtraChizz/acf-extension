"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EVENTS = void 0;

var _commonEvents = _interopRequireDefault(require("./common-events"));

var _regex = require("../../../../common/regex");

var _configError = _interopRequireDefault(require("../../../../error/config-error"));

var _systemError = _interopRequireDefault(require("../../../../error/system-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EVENTS = {
  BLUR: 'blur',
  CLICK: 'click',
  FOCUS: 'focus',
  SELECT: 'select',
  SUBMIT: 'submit',
  REMOVE: 'remove',
  CLEAR: 'clear'
};
exports.EVENTS = EVENTS;

class Events extends _commonEvents.default {
  perform(event) {
    const events = this._getVerifiedEvents(Object.keys(EVENTS), event);

    this._loopNodes(events, this._dispatchEvent);
  }

  _dispatchEvent(node, events) {
    if (!(node instanceof HTMLElement)) {
      throw new _configError.default('Not HTMLElement', 'XPath element is not instanceof HTMLElement');
    }

    const element = node;
    events.forEach(event => {
      switch (typeof event === 'string' ? event : event.type) {
        case 'blur':
          element.blur();
          break;

        case 'click':
          element.click();
          break;

        case 'focus':
          element.focus();
          break;

        case 'submit':
          if (node instanceof HTMLFormElement) {
            node.submit();
          } else if (_regex.FORM_ELEMENT_NODENAME.test(node.nodeName)) {
            node.form.submit();
          } else {
            throw new _configError.default('Invalid Element for submit', `Xpath element is not instance of ${_regex.FORM_ELEMENT_NODENAME}`);
          }

          break;

        case 'select':
          node.select();
          break;

        case 'remove':
          element.remove();
          break;

        case 'clear':
          if (_regex.FORM_CLEAR_ELEMENT_NODENAME.test(node.nodeName)) {
            node.value = '';
          } else {
            throw new _configError.default('Invalid Element for clear', `Xpath element is not instance of ${_regex.FORM_CLEAR_ELEMENT_NODENAME}`);
          }

          break;

        default:
          throw new _systemError.default('Unhandled Event', event);
      }
    });
  }

}

exports.default = Events;
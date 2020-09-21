"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _configError = _interopRequireDefault(require("../../../../error/config-error"));

var _systemError = _interopRequireDefault(require("../../../../error/system-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CommonEvents {
  constructor(nodes) {
    this._nodes = nodes;
  }

  _getVerifiedEvents(verifiedEvents, events) {
    if (!events) {
      throw new _systemError.default('Event is blank!', 'Event cant be blank | null | undefined');
    }

    events = events.split('::')[1];
    let result;

    try {
      const eventObject = JSON.parse(events);

      if (Array.isArray(eventObject)) {
        result = eventObject.filter(event => verifiedEvents.indexOf(typeof event === 'string' ? event : event.type) !== -1);
      } else if (verifiedEvents.indexOf(eventObject.type) !== -1) {
        result = [eventObject];
      }
    } catch (error) {
      const event = events.replace(/\W/g, '');

      if (verifiedEvents.indexOf(event) !== -1) {
        result = [event];
      }
    }

    if (result) {
      return result;
    } else {
      throw new _configError.default('Invalid Events', `${events} are not compatible by extension`);
    }

    ;
  }

  _loopNodes(events, trigger) {
    let i = 0;

    while (i < this._nodes.snapshotLength) {
      const node = this._nodes.snapshotItem(i++);

      node && trigger(node, events);
    }
  }

}

exports.default = CommonEvents;
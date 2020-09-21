"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MOUSE_EVENTS = void 0;

var _commonEvents = _interopRequireDefault(require("./common-events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MOUSE_EVENTS = {
  CONTEXT_MENU: 'contextmenu',
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  POINTER_DOWN: 'pointerdown',
  POINTER_UP: 'pointerup',
  DBL_CLICK: 'dblclick',
  CLICK: 'click'
};
exports.MOUSE_EVENTS = MOUSE_EVENTS;

class MouseEvents extends _commonEvents.default {
  perform(event) {
    const events = this._getVerifiedEvents(Object.keys(MOUSE_EVENTS), event);

    this._loopNodes(events, this._dispatchEvent);
  }

  _dispatchEvent(node, events) {
    events.forEach(event => {
      if (typeof event === 'string') {
        node.dispatchEvent(new MouseEvent(event, this._initMouseEvent()));
      } else {
        node.dispatchEvent(new MouseEvent(event.type, { ...this._initMouseEvent(),
          ...event
        }));
      }
    });
  }

  _initMouseEvent() {
    return {
      screenX: 10,
      screenY: 10,
      clientX: 10,
      clientY: 10,
      bubbles: true,
      cancelable: true,
      view: window
    };
  }

}

exports.default = MouseEvents;
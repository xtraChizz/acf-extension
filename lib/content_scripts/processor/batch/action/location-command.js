"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOCATION_COMMANDS = ['reload', 'href'];

class LocationCommand extends _common.default {
  constructor(value) {
    super();
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      try {
        this.commands = this.getCommands(LOCATION_COMMANDS, value);

        if (this.commands.length !== 0) {
          this.execCommand(value);
          this.success(`${this.commands} command exec Successfully!`);
        } else {
          this.error(`${value} not found`);
        }
      } catch (error) {
        this.error(error);
      }
    });
  }

  getCommands(EVENTS, value) {
    const commands = value.split('::')[1];

    try {
      return JSON.parse(commands).filter(command => EVENTS.indexOf(command) !== -1);
    } catch (error) {
      return EVENTS.indexOf(commands.replace(/\W/g, '')) !== -1 ? [commands.replace(/\W/g, '')] : [];
    }
  }

  execCommand(value) {
    this.commands.forEach(command => {
      switch (command) {
        case 'reload':
          location.reload();
          break;

        case 'href':
          location.href = value.split('::')[2];
          break;
      }
    });
  }

}

exports.default = LocationCommand;
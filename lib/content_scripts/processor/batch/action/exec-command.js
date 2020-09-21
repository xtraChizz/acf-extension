"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EXEC_COMMANDS = ['cut', 'copy', 'delete', 'paste', 'selectAll'];

class ExecCommand extends _common.default {
  process(command) {
    this.execCommands = this.getExecCommands(command);

    if (this.execCommands.length !== 0) {
      this.execCommand();
      return `${this.execCommands} command exec Successfully!`;
    } else {
      throw new Error(`${command} not found`);
    }
  }

  getExecCommands(command) {
    const execCommands = command.split('::')[1];

    try {
      return JSON.parse(execCommands).filter(execCommand => EXEC_COMMANDS.indexOf(execCommand) !== -1);
    } catch (error) {
      return EXEC_COMMANDS.indexOf(execCommands.replace(/\W/g, '')) !== -1 ? [execCommands.replace(/\W/g, '')] : [];
    }
  }

  execCommand() {
    this.execCommands.forEach(command => {
      document.execCommand(command, false, undefined);
    });
  }

}

exports.default = ExecCommand;
import Common from './common'

const EXEC_COMMANDS = ['cut', 'copy', 'delete', 'paste', 'selectAll']

export default class ExecCommand extends Common {
  process (command) {
    this.execCommands = this.getExecCommands(command)
    if (this.execCommands.length !== 0) {
      this.execCommand()
      return `${this.execCommands} command exec Successfully!`
    } else {
      throw new Error(`${command} not found`)
    }
  }

  getExecCommands (command) {
    const execCommands = command.split('::')[1]
    try {
      return JSON.parse(execCommands).filter((execCommand) => EXEC_COMMANDS.indexOf(execCommand) !== -1)
    } catch (error) {
      return EXEC_COMMANDS.indexOf(execCommands.replace(/\W/g, '')) !== -1 ? [execCommands.replace(/\W/g, '')] : []
    }
  }

  execCommand () {
    this.execCommands.forEach(command => {
      document.execCommand(command, false, undefined)
    })
  }
}

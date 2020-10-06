import CommonEvents from './common.events'

const EXEC_COMMANDS = ['cut', 'copy', 'delete', 'paste', 'selectAll']

export const ExecCommandEvents = ((CommonEvents) => {
  const start = (command) => {
    // Logger.debug('\t\t\t\t\t ExecCommandEvents >> start')
    const execCommands = CommonEvents.getVerifiedEvents(EXEC_COMMANDS, command)
    _execCommand(execCommands)
  }

  const _execCommand = () => {
    this.execCommands.forEach(command => {
      document.execCommand(command, false, undefined)
    })
  }
  return { start }
})(CommonEvents)

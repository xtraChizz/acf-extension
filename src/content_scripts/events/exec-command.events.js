import { Logger } from '@dhruv-techapps/core-common'
import CommonEvents from './common.events'

const EXEC_COMMANDS = ['cut', 'copy', 'delete', 'paste', 'selectAll']

export const ExecCommandEvents = ((CommonEvents) => {
  const start = (command) => {
    Logger.log('ExecCommandEvents - start')
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

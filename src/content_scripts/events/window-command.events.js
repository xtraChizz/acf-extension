import { SystemError } from '../error'
import CommonEvents from './common.events'

const WINDOW_COMMANDS = ['open', 'close', 'cut', 'copy', 'paste']

export const WindowCommandEvents = (() => {
  const execCommand = (commands, value) => {
    const values = value.split('::')
    commands.forEach(command => {
      switch (command) {
        case 'open':
          window.open(values[2], values[3] || '_blank')
          break
        case 'close':
          window.close()
          break
        case 'cut':
          document.execCommand('cut')
          break
        case 'copy':
          document.execCommand('copy')
          break
        case 'paste':
          document.execCommand('paste')
          break
        default:
          throw new SystemError('Unhandled Event', command)
      }
    })
  }
  const start = value => {
    // Logger.debug('\t\t\t\t\t WindowCommandEvents >> start')
    const commands = CommonEvents.getVerifiedEvents(WINDOW_COMMANDS, value)
    execCommand(commands, value)
  }
  return { start }
})()

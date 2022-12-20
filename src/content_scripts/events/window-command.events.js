import { Logger } from '@dhruv-techapps/core-common'
import { SystemError } from '../error'
import CommonEvents from './common.events'

const WINDOW_COMMANDS = ['copy', 'cut', 'delete', 'paste', 'selectAll', 'open', 'close', 'focus', 'blur', 'print', 'stop', 'moveBy', 'moveTo']

export const WindowCommandEvents = (() => {
  const execCommand = (commands, value) => {
    commands.forEach(command => {
      switch (command) {
        case 'close':
          window.close()
          break
        case 'cut':
          document.execCommand('cut')
          break
        case 'copy':
          document.execCommand('copy')
          break
        case 'delete':
          document.execCommand('delete')
          break
        case 'paste':
          document.execCommand('paste')
          break
        case 'selectAll':
          document.execCommand('selectAll')
          break
        case 'focus':
          window.focus()
          break
        case 'blur':
          window.blur()
          break
        case 'print':
          window.print()
          break
        case 'stop':
          window.stop()
          break
        case 'moveBy':
          // eslint-disable-next-line no-case-declarations
          const [x, y] = value.split('::')[2].split(',')
          window.moveBy(x, y)
          break
        case 'moveTo':
          // eslint-disable-next-line no-case-declarations
          const [xAxis, yAxis] = value.split('::')[2].split(',')
          window.moveTo(xAxis, yAxis)
          break
        case 'open':
          try {
            const { URL, name, specs, replace } = JSON.parse(value.split('::')[2])
            window.open(URL, name, specs, replace)
          } catch (error) {
            window.open(value.split('::')[2])
          }
          break
        default:
          throw new SystemError('Unhandled Event', command)
      }
    })
  }
  const start = value => {
    const commands = CommonEvents.getVerifiedEvents(WINDOW_COMMANDS, value)
    Logger.colorDebug('WindowCommandEvents', commands)
    execCommand(commands, value)
  }
  return { start }
})()

import { Logger } from '@dhruv-techapps/core-common'
import { SystemError } from '../error'
import CommonEvents from './common.events'

const LOCATION_COMMANDS = ['reload', 'href', 'replace', 'open', 'close', 'focus', 'blur', 'print', 'stop', 'moveBy', 'moveTo']

export const LocationCommandEvents = (() => {
  const execCommand = (commands, value) => {
    commands.forEach(command => {
      switch (command) {
        case 'reload':
          window.location.reload()
          break
        case 'href':
          // eslint-disable-next-line prefer-destructuring
          window.location.href = value.split('::')[2]
          break
        case 'replace':
          window.location.replace(value.split('::')[2])
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
        case 'close':
          window.close()
          break
        default:
          throw new SystemError('Unhandled Event', command)
      }
    })
  }

  const start = value => {
    const commands = CommonEvents.getVerifiedEvents(LOCATION_COMMANDS, value)
    Logger.colorDebug('LocationCommandEvents', { commands, value })
    execCommand(commands, value)
  }
  return { start }
})()

import { SystemError } from '../error'
import CommonEvents from './common.events'

const LOCATION_COMMANDS = ['reload', 'href', 'replace']

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
        default:
          throw new SystemError('Unhandled Event', command)
      }
    })
  }

  const start = value => {
    // Logger.debug('\t\t\t\t\t LocationCommandEvents >> start')
    const commands = CommonEvents.getVerifiedEvents(LOCATION_COMMANDS, value)
    execCommand(commands, value)
  }
  return { start }
})()

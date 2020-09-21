import { Logger } from '@dhruv-techapps/core-common'
import { SystemError } from '../error'
import CommonEvents from './common.events'

const LOCATION_COMMANDS = ['reload', 'href']

export const LocationCommandEvents = ((CommonEvents) => {
  const start = (value) => {
    Logger.log('LocationCommandEvents - start')
    const commands = CommonEvents.getVerifiedEvents(LOCATION_COMMANDS, value)
    _execCommand(commands, value)
  }

  const _execCommand = (commands, value) => {
    commands.forEach(command => {
      switch (command) {
        case 'reload':
          location.reload()
          break
        case 'href':
          location.href = value.split('::')[2]
          break
        default:
          throw new SystemError('Unhandled Event', event)
      }
    })
  }
  return { start }
})(CommonEvents)

import { Logger } from '@dhruv-techapps/core-common'
import { SystemError } from '../error'
import CommonEvents from './common.events'

const WINDOW_COMMANDS = ['open']

export const WindowCommandEvents = ((CommonEvents) => {
  const start = (value) => {
    Logger.debug('\t\t\t\t\t WindowCommandEvents >> start')
    const commands = CommonEvents.getVerifiedEvents(WINDOW_COMMANDS, value)
    _execCommand(commands, value)
  }

  const _execCommand = (commands, value) => {
    const values = value.split('::')
    commands.forEach(command => {
      switch (command) {
        case 'open':
          window.open(values[2], values[3] || '_blank')
          break
        default:
          throw new SystemError('Unhandled Event', event)
      }
    })
  }
  return { start }
})(CommonEvents)

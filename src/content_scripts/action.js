import { Logger } from '@dhruv-techapps/core-common'
import { ACTION_STATUS } from '@dhruv-techapps/acf-common'
import Common from './common'
import Addon from './addon'
import Statement from './statement'
import Value from './util/value'
import Events from './events'
import { wait } from './util'

const LOGGER_LETTER = 'Action'

const Action = (() => {
  let elements
  let value
  let actionIndex
  const repeatFunc = async (repeat, repeatInterval) => {
    if (repeat > 0 || repeat < -1) {
      await wait(repeatInterval, `${LOGGER_LETTER} Repeat`, repeat, '<interval>')
      repeat -= 1
      await Events.check(value, elements)
      return await repeatFunc(repeat, repeatInterval)
    }
    Logger.groupEnd(`${LOGGER_LETTER} #${actionIndex}`)
    return ACTION_STATUS.DONE
  }

  const start = async (action, batchRepeat, sheets, actions, index) => {
    try {
      actionIndex = index
      Logger.group(`${LOGGER_LETTER} #${actionIndex}`)
      if (await Statement.check(actions, action.statement)) {
        await wait(action.initWait, `${LOGGER_LETTER} initWait`)
        if (await Addon.check(action.settings, batchRepeat, action.addon)) {
          const elementFinder = action.elementFinder.replaceAll('<batchRepeat>', batchRepeat).replaceAll('<batchCount>', batchRepeat + 1)
          elements = await Common.start(elementFinder, action.settings)
          if (!elements) {
            return ACTION_STATUS.SKIPPED
          }
          value = Value.getValue(action.value, batchRepeat, sheets)
          await Events.check(value, elements)
          return await repeatFunc(action.repeat, action.repeatInterval)
        }
      }
      Logger.groupEnd(`${LOGGER_LETTER} #${actionIndex}`)
      return ACTION_STATUS.SKIPPED
    } catch (error) {
      Logger.groupEnd(`${LOGGER_LETTER} #${actionIndex}`)
      throw error
    }
  }

  return { start }
})()

export default Action

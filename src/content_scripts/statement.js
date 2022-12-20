import { ACTION_CONDITION_OPR, ACTION_RUNNING } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import Common from './common'

const Statement = (() => {
  const conditionResult = (conditions, actions) => {
    Logger.colorDebug('Condition Result', { conditions, actions })
    return Common.stringFunction(
      conditions
        .map(({ actionIndex, status, operator }) => {
          if (operator) {
            operator = operator === ACTION_CONDITION_OPR.AND ? '&&' : '||'
          } else {
            operator = ''
          }
          return `${operator} ${actions[actionIndex] === status} `
        })
        .join('')
    )
  }

  const checkThen = (condition, then) => {
    Logger.colorDebug('Check Then', { condition, then })
    return condition ? then === ACTION_RUNNING.PROCEED : then !== ACTION_RUNNING.PROCEED
  }

  const check = async (actions, { conditions, then } = {}) => {
    if (conditions && then) {
      return checkThen(conditionResult(conditions, actions), then)
    }

    return true
  }

  return { check, checkThen, conditionResult }
})()

export default Statement

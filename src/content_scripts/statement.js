import { ACTION_CONDITION_OPR, ACTION_RUNNING } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'

const Statement = (() => {
  const conditionResult = (conditions, actions) => {
    Logger.colorDebug('Condition Result', { conditions, actions })
    return conditions
      .map(({ actionIndex, status, operator }) => ({ status: actions[actionIndex] === status, operator }))
      .reduce((accumulator, currentValue) => {
        if (currentValue.operator === undefined) {
          return currentValue.status
        }
        return currentValue.operator === ACTION_CONDITION_OPR.AND ? accumulator && currentValue.status : accumulator || currentValue.status
      }, undefined)
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

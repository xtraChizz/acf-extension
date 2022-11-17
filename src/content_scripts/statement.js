import { ACTION_CONDITION_OPR, ACTION_RUNNING } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import Common from './common'

const Statement = (() => {
  const conditionResult = (conditions, actions) =>
    Common.stringFunction(
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

  const checkThen = (condition, then) => (condition ? then === ACTION_RUNNING.PROCEED : then !== ACTION_RUNNING.PROCEED)

  const check = async ({ conditions, then } = {}, actions) => {
    Logger.debug('\t\t\t\t\t Statement >> check', conditions, then, actions)
    if (conditions && then) {
      return checkThen(conditionResult(conditions, actions), then)
    }
    return true
  }

  return { check, checkThen, conditionResult }
})()

export default Statement

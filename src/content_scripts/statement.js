import { ACTION_CONDITION_OPR } from '@dhruv-techapps/acf-common'
import { Logger } from '@dhruv-techapps/core-common'
import Common from './common'

const Statement = (() => {
  const check = async ({ conditions, then } = {}, actions) => {
    Logger.debug('\t\t\t\t\t Statement >> check', actions)
    if (conditions && then) {
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
    return true
  }

  return { check }
})()

export default Statement

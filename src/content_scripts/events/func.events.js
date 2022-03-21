import { Logger } from '@dhruv-techapps/core-common'
import Common from '../common'

export const FuncEvents = (() => {
  const start = value => {
    Logger.debug('\t\t\t\t\t FuncEvents >> start')
    Common.stringFunction(value)
  }
  return { start }
})()

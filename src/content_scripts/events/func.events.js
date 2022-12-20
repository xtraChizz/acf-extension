import { Logger } from '@dhruv-techapps/core-common'
import Common from '../common'

export const FuncEvents = (() => {
  const start = value => {
    Logger.colorDebug('FuncEvents', value)
    Common.stringFunction(value)
  }
  return { start }
})()

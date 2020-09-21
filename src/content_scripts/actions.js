import { Logger } from '@dhruv-techapps/core-common'
import Action from './action'

const Actions = (() => {
  const start = (actions) => {
    Logger.log('Actions - start')
    for (let i = 0; i < actions.length; i++) {
      Action.start(actions[i])
    }
  }
  return { start }
})()

export default Actions

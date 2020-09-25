import { Logger } from '@dhruv-techapps/core-common'
import Action from './action'

const Actions = (() => {
  const start = async (actions) => {
    Logger.debug('\t\t\t Actions >> start')
    for (let i = 0; i < actions.length; i++) {
      await Action.start(actions[i])
    }
  }
  return { start }
})()

export default Actions

import { Logger } from '@dhruv-techapps/core-common'
import Actions from './actions'
import { wait } from './util'

const Batch = (() => {
  let batch, actions
  const start = async (_batch, _actions) => {
    Logger.log('Batch - start')
    batch = _batch
    actions = _actions
    await Actions.start(_actions)
    _checkRepeat()
  }

  const _checkRepeat = async () => {
    Logger.log('Batch - _checkRepeat')
    if (batch.repeat) {
      for (let i = 0; i < batch.repeat; i++) {
        if (batch.repeatInterval) {
          await wait(batch.repeatInterval)
          await Actions.start(actions)
        } else {
          await Actions.start(actions)
        }
        _checkRepeat()
      }
    }
  }

  return { start }
})()

export default Batch

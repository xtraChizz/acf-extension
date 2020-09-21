import { Logger } from '@dhruv-techapps/core-common'
import Actions from './actions'
import { wait } from './util'

const Batch = (() => {
  const start = async (_batch, _actions) => {
    Logger.log('Batch - start')
    this.batch = _batch
    this.actions = _actions
    Actions.start(_actions).then(_checkRepeat.bind(this))
  }

  const _checkRepeat = async () => {
    Logger.log('Batch - _checkRepeat')
    if (this.batch.repeat) {
      for (let i = 0; i < this.batch.repeat; i++) {
        if (this.batch.repeatInterval) {
          await wait(this.batch.repeatInterval)
          Actions.start(this.actions).then(_checkRepeat.bind(this))
        } else {
          Actions.start(this.actions).then(_checkRepeat.bind(this))
        }
      }
    }
  }

  return { start }
})()

export default Batch

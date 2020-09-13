import Action from './batch/action'

export default class Batch {
  constructor (batch, actions) {
    this.startAction(batch, actions)
  }

  async startAction (batch, actions) {
    if (batch.repeat) {
      for (var i = 0; i < batch.repeat; i++) {
        if (batch.repeatInterval) {
          setTimeout(function () { Action(actions) }, batch.repeatInterval * 1000)
        } else {
          Action(actions)
        }
      }
    } else {
      Action(actions)
    }
  }
}

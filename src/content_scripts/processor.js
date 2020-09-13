import Batch from './processor/batch'
import Common from './processor/batch/action/common'

export default class Processor {
  constructor (config) {
    if (config && config.enable) {
      if (config.startTime && config.startTime.match(/^\d{2}:\d{2}:\d{2}$/)) {
        this.schedule(config)
      } else {
        this.startBatch(config)
      }
    }
  }

  async startBatch (config) {
    await Common.wait(config.initWait)
    Batch(config)
  }

  schedule (config) {
    var rDate = new Date()
    rDate.setHours(Number(config.startTime.split(':')[0]))
    rDate.setMinutes(Number(config.startTime.split(':')[1]))
    rDate.setSeconds(Number(config.startTime.split(':')[2]))
    setTimeout(this.startBatch.bind(this, config), rDate.getTime() - new Date().getTime())
  }
}

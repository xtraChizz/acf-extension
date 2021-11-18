import { Logger } from '@dhruv-techapps/core-common'

export const sleep = async msec => new Promise(resolve => setTimeout(resolve, msec))
export const wait = async (time, type = '') => {
  if (time) {
    let waitTime = Number(time) * 1000
    if (/^\d+(\.\d+)?e\d+(\.\d+)?$/.test(time.toString())) {
      const range = time.toString().split('e')
      waitTime = (Math.floor(Math.random() * Number(range[1])) + Number(range[0])) * 1000
    }
    Logger.info(`${type} waiting... ${waitTime / 1000} sec`)
    await sleep(waitTime)
  }
}

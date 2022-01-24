import { Logger } from '@dhruv-techapps/core-common'

export const sleep = async msec => new Promise(resolve => setTimeout(resolve, msec))
export const wait = async (time, type = '') => {
  if (time) {
    let waitTime = Number(time) * 1000
    if (/^\d+(\.\d+)?e\d+(\.\d+)?$/.test(time.toString())) {
      const [start, end] = time
        .toString()
        .split('e')
        .map(n => Number(n))
      waitTime = (Math.floor(Math.random() * (end - start)) + start) * 1000
    }
    Logger.info(`${type} waiting... ${waitTime / 1000} sec`)
    await sleep(waitTime)
  }
}

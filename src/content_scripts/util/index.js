import { Logger } from '@dhruv-techapps/core-common'

export const sleep = async (msec) => {
  return new Promise(resolve => setTimeout(resolve, msec))
}
export const wait = async (initWait) => {
  if (initWait) {
    let waitTime = Number(initWait) * 1000
    if (/\d+e\d+/.test(initWait.toString())) {
      const range = initWait.toString().split('e')
      waitTime = (Math.floor(Math.random() * parseInt(range[1])) + parseInt(range[0])) * 1000
    }
    Logger.debug(`waiting... ${waitTime / 1000} sec`)
    await sleep(waitTime)
  }
}
export const FORM_ELEMENT_NODENAME = /^(select|textarea|input|button|label|option|optgroup|fieldset|output)$/gi
export const FORM_CLEAR_ELEMENT_NODENAME = /^(select|textarea|input)$/gi
export const SELECT_TEXTAREA_NODENAME = /^(select|textarea)$/gi
export const RADIO_CHECKBOX_NODENAME = /^(radio|checkbox)$/gi

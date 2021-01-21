import { Logger } from '@dhruv-techapps/core-common'

export const sleep = async (msec) => {
  return new Promise(resolve => setTimeout(resolve, msec))
}
export const wait = async (wait, type = '') => {
  if (wait) {
    let waitTime = Number(wait) * 1000
    if (/^\d+(\.\d+)?e\d+(\.\d+)?$/.test(wait.toString())) {
      const range = wait.toString().split('e')
      waitTime = (Math.floor(Math.random() * Number(range[1])) + Number(range[0])) * 1000
    }
    Logger.info(`${type} waiting... ${waitTime / 1000} sec`)
    await sleep(waitTime)
  }
}
export const FORM_ELEMENT_NODENAME = /^(select|textarea|input|button|label|option|optgroup|fieldset|output)$/gi
export const FORM_CLEAR_ELEMENT_NODENAME = /^(select|textarea|input)$/gi
export const SELECT_TEXTAREA_NODENAME = /^(select|textarea)$/gi
export const RADIO_CHECKBOX_NODENAME = /^(radio|checkbox)$/gi

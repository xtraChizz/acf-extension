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
export const FORM_ELEMENT_NODE_NAME = /^(select|textarea|input|button|label|option|optgroup|fieldset|output)$/gi
export const FORM_CLEAR_ELEMENT_NODE_NAME = /^(select|textarea|input)$/gi
export const SELECT_TEXTAREA_NODE_NAME = /^(select|textarea)$/gi
export const RADIO_CHECKBOX_NODE_NAME = /^(radio|checkbox)$/gi
